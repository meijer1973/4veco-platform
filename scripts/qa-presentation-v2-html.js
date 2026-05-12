#!/usr/bin/env node
const fs = require('fs');
const net = require('net');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');

const htmlPath = path.resolve(process.argv[2] || '');
const outDir = path.resolve(process.argv[3] || path.join(process.env.TEMP || 'C:\\tmp', 'presentation-v2-qa'));

if (!htmlPath || !fs.existsSync(htmlPath)) {
  console.error('Usage: node scripts/qa-presentation-v2-html.js <presentation.html> [screenshot-dir]');
  process.exit(2);
}

fs.mkdirSync(outDir, { recursive: true });

const browserPath = findBrowser();
const port = 9400 + Math.floor(Math.random() * 400);
const profile = path.join(process.env.TEMP || 'C:\\tmp', `pv2-chrome-${Date.now()}`);

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('No Chrome/Edge executable found for presentation-v2 QA');
  return found;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.json();
}

async function waitForChrome() {
  for (let i = 0; i < 80; i += 1) {
    try {
      return await fetchJson(`http://127.0.0.1:${port}/json/version`);
    } catch (_err) {
      await sleep(100);
    }
  }
  throw new Error('Chrome/Edge did not expose the DevTools endpoint');
}

class CdpSocket {
  constructor(wsUrl) {
    this.url = new URL(wsUrl);
    this.buffer = Buffer.alloc(0);
    this.nextId = 1;
    this.pending = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      const key = crypto.randomBytes(16).toString('base64');
      const request = [
        `GET ${this.url.pathname}${this.url.search} HTTP/1.1`,
        `Host: ${this.url.host}`,
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Key: ${key}`,
        'Sec-WebSocket-Version: 13',
        '',
        '',
      ].join('\r\n');
      const socket = net.connect(Number(this.url.port), this.url.hostname, () => socket.write(request));
      this.socket = socket;
      let header = Buffer.alloc(0);
      const onData = (chunk) => {
        header = Buffer.concat([header, chunk]);
        const split = header.indexOf('\r\n\r\n');
        if (split === -1) return;
        const status = header.slice(0, split).toString('utf8');
        if (!/^HTTP\/1\.1 101/.test(status)) {
          reject(new Error(`WebSocket handshake failed: ${status}`));
          return;
        }
        socket.off('data', onData);
        socket.on('data', (data) => this.onData(data));
        socket.on('error', reject);
        const rest = header.slice(split + 4);
        if (rest.length) this.onData(rest);
        resolve();
      };
      socket.on('data', onData);
      socket.on('error', reject);
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    this.socket.write(frameWebSocket(JSON.stringify({ id, method, params })));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }
      }, 15000);
    });
  }

  onData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 2) {
      const b1 = this.buffer[0];
      const b2 = this.buffer[1];
      let length = b2 & 0x7f;
      let offset = 2;
      if (length === 126) {
        if (this.buffer.length < 4) return;
        length = this.buffer.readUInt16BE(2);
        offset = 4;
      } else if (length === 127) {
        if (this.buffer.length < 10) return;
        length = Number(this.buffer.readBigUInt64BE(2));
        offset = 10;
      }
      const masked = Boolean(b2 & 0x80);
      const maskOffset = offset;
      if (masked) offset += 4;
      if (this.buffer.length < offset + length) return;
      let payload = this.buffer.slice(offset, offset + length);
      if (masked) {
        const mask = this.buffer.slice(maskOffset, maskOffset + 4);
        payload = Buffer.from(payload.map((value, i) => value ^ mask[i % 4]));
      }
      this.buffer = this.buffer.slice(offset + length);
      if ((b1 & 0x0f) === 1) this.onMessage(payload.toString('utf8'));
    }
  }

  onMessage(text) {
    const message = JSON.parse(text);
    if (!message.id || !this.pending.has(message.id)) return;
    const pending = this.pending.get(message.id);
    this.pending.delete(message.id);
    if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
    else pending.resolve(message.result);
  }

  close() {
    this.socket?.end();
  }
}

function frameWebSocket(text) {
  const payload = Buffer.from(text);
  let header;
  if (payload.length < 126) {
    header = Buffer.from([0x81, 0x80 | payload.length]);
  } else {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
  }
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i += 1) masked[i] = payload[i] ^ mask[i % 4];
  return Buffer.concat([header, mask, masked]);
}

async function waitForDeck(cdp) {
  for (let i = 0; i < 80; i += 1) {
    const result = await cdp.send('Runtime.evaluate', {
      expression: "Boolean(document.querySelector('[data-pv2]'))",
      returnByValue: true,
    });
    if (result.result.value) return;
    await sleep(100);
  }
  throw new Error('Presentation root [data-pv2] not found');
}

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}

async function runScenario(cdp, scenario) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: scenario.width,
    height: scenario.height,
    deviceScaleFactor: 1,
    mobile: Boolean(scenario.mobile),
  });
  await cdp.send('Page.navigate', { url: pathToFileURL(htmlPath).href });
  await waitForDeck(cdp);
  await sleep(250);
  if (scenario.setup) await evaluate(cdp, scenario.setup);
  await sleep(150);

  const results = [];
  const slideCount = await evaluate(cdp, "document.querySelectorAll('[data-pv2-slide]').length");
  for (let slide = 1; slide <= slideCount; slide += 1) {
    await evaluate(cdp, `document.querySelector('[data-pv2-link="${slide}"]').click()`);
    if (scenario.afterSlide) await evaluate(cdp, scenario.afterSlide);
    await sleep(100);
    const result = await evaluate(cdp, fitExpression(scenario.name, slide));
    const png = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const file = path.join(outDir, `${scenario.name}-slide-${slide}.png`);
    fs.writeFileSync(file, Buffer.from(png.data, 'base64'));
    results.push({ ...result, screenshot: file });
  }
  return results;
}

function fitExpression(scenarioName, slideNumber) {
  return `(() => {
    const root = document.querySelector('[data-pv2]');
    const slide = document.querySelector('.pv2-slide.is-active') || document.querySelector('.pv2-slide:not([hidden])');
    const canvas = slide.querySelector('.pv2-slide-canvas');
    const notes = slide.querySelector('.pv2-notes');
    const canvasRect = canvas.getBoundingClientRect();
    const notesRect = notes.getBoundingClientRect();
    const descendants = [...canvas.querySelectorAll('*')].filter((el) => {
      const style = getComputedStyle(el);
      return !el.closest('.pv2-sr-speaker-text') && style.display !== 'none' && style.visibility !== 'hidden';
    });
    const spills = [];
    for (const el of descendants) {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      const over = {
        left: Math.round(canvasRect.left - rect.left),
        top: Math.round(canvasRect.top - rect.top),
        right: Math.round(rect.right - canvasRect.right),
        bottom: Math.round(rect.bottom - canvasRect.bottom),
      };
      if (over.left > 1 || over.top > 1 || over.right > 1 || over.bottom > 1) {
        spills.push({
          tag: el.tagName,
          className: String(el.className || ''),
          text: String(el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 90),
          over,
        });
      }
    }
    const notesStyle = getComputedStyle(notes);
    const notesRightSide = notesStyle.display === 'none' || notesRect.left >= canvasRect.right - 1;
    return {
      scenario: '${scenarioName}',
      slide: ${slideNumber},
      rootClass: root.className,
      canvas: {
        width: Math.round(canvasRect.width),
        height: Math.round(canvasRect.height),
        ratio: Number((canvasRect.width / canvasRect.height).toFixed(3)),
      },
      spills,
      notes: {
        display: notesStyle.display,
        rightSide: notesRightSide,
        width: Math.round(notesRect.width),
        height: Math.round(notesRect.height),
      },
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  })()`;
}

async function main() {
  const browser = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    await waitForChrome();
    const target = await fetchJson(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
    const cdp = new CdpSocket(target.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const scenarios = [
      { name: 'desktop', width: 1366, height: 768 },
      {
        name: 'wide-notes',
        width: 1600,
        height: 900,
        setup: "document.querySelector('[data-pv2]').classList.add('pv2-speaker-notes-open'); document.querySelectorAll('.pv2-notes').forEach((el) => { el.open = true; });",
      },
      {
        name: 'fullscreen',
        width: 1366,
        height: 768,
        setup: "document.querySelector('[data-pv2]').classList.add('is-fullscreen');",
        afterSlide: "document.querySelector('[data-pv2]').classList.add('is-fullscreen');",
      },
      {
        name: 'dark',
        width: 1366,
        height: 768,
        setup: "document.querySelector('[data-pv2-theme]').click();",
      },
      {
        name: 'dark-notes',
        width: 1600,
        height: 900,
        setup: "document.querySelector('[data-pv2-theme]').click(); document.querySelector('[data-pv2]').classList.add('pv2-speaker-notes-open'); document.querySelectorAll('.pv2-notes').forEach((el) => { el.open = true; });",
      },
      { name: 'mobile', width: 390, height: 844, mobile: true },
    ];

    const results = [];
    for (const scenario of scenarios) {
      results.push(...await runScenario(cdp, scenario));
    }
    cdp.close();

    const failures = results.filter((result) => {
      const ratioBad = !result.scenario.includes('mobile') && Math.abs(result.canvas.ratio - 1.778) > 0.02;
      const notesBad = result.scenario === 'wide-notes' && result.notes.display !== 'none' && !result.notes.rightSide;
      return result.spills.length || result.horizontalOverflow || ratioBad || notesBad;
    });

    console.log(JSON.stringify({ htmlPath, outDir, results }, null, 2));
    if (failures.length) {
      console.error('\nPresentation v2 QA failed: visible slide content spills outside the canvas.');
      console.error(JSON.stringify(failures, null, 2));
      process.exit(1);
    }
    console.log(`Presentation v2 QA passed. Screenshots: ${outDir}`);
  } finally {
    browser.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
