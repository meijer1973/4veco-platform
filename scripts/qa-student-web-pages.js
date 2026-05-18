#!/usr/bin/env node
const fs = require('fs');
const net = require('net');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');

const outDir = path.resolve(process.argv[2] || '');
const pages = process.argv.slice(3).map((file) => path.resolve(file));

if (!outDir || pages.length === 0 || pages.some((file) => !fs.existsSync(file))) {
  console.error('Usage: node scripts/qa-student-web-pages.js <screenshot-dir> <html> [html...]');
  process.exit(2);
}

fs.mkdirSync(outDir, { recursive: true });

const browserPath = findBrowser();
const port = 9800 + Math.floor(Math.random() * 300);
const profile = path.join(process.env.TEMP || 'C:\\tmp', `student-web-qa-${Date.now()}`);

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('No Chrome/Edge executable found for student-web QA');
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

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}

async function waitFor(cdp, expression) {
  for (let i = 0; i < 80; i += 1) {
    if (await evaluate(cdp, expression)) return;
    await sleep(100);
  }
  throw new Error(`Page did not become ready: ${expression}`);
}

function slugFor(file, scenario) {
  const base = path.basename(file, '.html')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `${base}-${scenario}.png`;
}

async function runPage(cdp, file, scenario) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: scenario.width,
    height: scenario.height,
    deviceScaleFactor: 1,
    mobile: scenario.mobile,
  });
  await cdp.send('Page.navigate', { url: pathToFileURL(file).href });
  await waitFor(cdp, 'document.readyState === "complete"');
  if (scenario.theme === 'dark') {
    await evaluate(cdp, 'localStorage.setItem("quizMode","dark"); document.documentElement.setAttribute("data-theme","dark");');
  } else {
    await evaluate(cdp, 'localStorage.setItem("quizMode","light"); document.documentElement.setAttribute("data-theme","light");');
  }

  const isGraphical = /grafiekenspel/i.test(path.basename(file));
  await waitFor(cdp, isGraphical
    ? 'Boolean(document.querySelector("#g-app svg.g-chart-svg"))'
    : 'Boolean(document.querySelector(".resource-grid"))');
  await sleep(250);

  const checks = await evaluate(cdp, `(() => {
    const text = document.body.textContent || '';
    const rootTheme = document.documentElement.getAttribute('data-theme');
    const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
    const result = {
      textLength: text.trim().length,
      rootTheme,
      horizontalOverflow,
      hasThreeRoutes: /Redeneren/.test(text) && /Rekenen/.test(text) && /Grafieken/.test(text),
      hasGrafiekenspel: /Grafiekenspel/.test(text),
      hasControl: /Controleer/.test(text),
      svgCount: document.querySelectorAll('svg.g-chart-svg').length,
      chartSpills: []
    };
    document.querySelectorAll('.g-chart-wrap').forEach((wrap, index) => {
      const svg = wrap.querySelector('svg');
      if (!svg) return;
      const wr = wrap.getBoundingClientRect();
      const sr = svg.getBoundingClientRect();
      if (sr.left < wr.left - 1 || sr.right > wr.right + 1) {
        result.chartSpills.push({ index, wrapWidth: Math.round(wr.width), svgWidth: Math.round(sr.width) });
      }
    });
    return result;
  })()`);

  const png = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const screenshot = path.join(outDir, slugFor(file, `${scenario.name}-${scenario.theme}`));
  fs.writeFileSync(screenshot, Buffer.from(png.data, 'base64'));
  return { file, scenario: scenario.name, theme: scenario.theme, screenshot, checks };
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
      { name: 'desktop', width: 1366, height: 900, mobile: false, theme: 'light' },
      { name: 'desktop', width: 1366, height: 900, mobile: false, theme: 'dark' },
      { name: 'mobile', width: 390, height: 844, mobile: true, theme: 'light' },
      { name: 'mobile', width: 390, height: 844, mobile: true, theme: 'dark' },
    ];

    const results = [];
    for (const file of pages) {
      for (const scenario of scenarios) {
        results.push(await runPage(cdp, file, scenario));
      }
    }
    cdp.close();

    const failures = results.filter((result) => {
      const isGraphical = /grafiekenspel/i.test(path.basename(result.file));
      if (result.checks.textLength < 100) return true;
      if (result.checks.rootTheme !== result.theme) return true;
      if (result.checks.horizontalOverflow) return true;
      if (isGraphical && (!result.checks.hasControl || result.checks.svgCount < 1 || result.checks.chartSpills.length)) return true;
      if (!isGraphical && (!result.checks.hasThreeRoutes || !result.checks.hasGrafiekenspel)) return true;
      return false;
    });

    console.log(JSON.stringify({ outDir, results }, null, 2));
    if (failures.length) {
      console.error('\nStudent-web page QA failed.');
      console.error(JSON.stringify(failures, null, 2));
      process.exit(1);
    }
    console.log(`Student-web page QA passed. Screenshots: ${outDir}`);
  } finally {
    browser.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
