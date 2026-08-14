const { EventEmitter } = require('events');
const { PassThrough } = require('stream');

const { waitForChrome } = require('../qa-presentation-v2-html');

function makeBrowser() {
  const browser = new EventEmitter();
  browser.stderr = new PassThrough();
  return browser;
}

function expectListenersCleaned(browser) {
  expect(browser.listenerCount('error')).toBe(0);
  expect(browser.listenerCount('exit')).toBe(0);
  expect(browser.stderr.listenerCount('data')).toBe(0);
}

describe('presentation-v2 browser startup', () => {
  test('allows a delayed DevTools endpoint and cleans up startup listeners', async () => {
    const browser = makeBrowser();
    const fetchVersion = jest
      .fn()
      .mockRejectedValueOnce(new Error('connection refused'))
      .mockRejectedValueOnce(new Error('connection refused'))
      .mockResolvedValue({ webSocketDebuggerUrl: 'ws://127.0.0.1/devtools/browser/test' });

    await expect(waitForChrome({
      browser,
      executablePath: 'C:\\Chrome\\chrome.exe',
      port: 9222,
      timeoutMs: 1000,
      pollIntervalMs: 0,
      fetchVersion,
    })).resolves.toEqual({ webSocketDebuggerUrl: 'ws://127.0.0.1/devtools/browser/test' });

    expect(fetchVersion).toHaveBeenCalledTimes(3);
    expectListenersCleaned(browser);
  });

  test('fails closed on a bounded endpoint timeout', async () => {
    const browser = makeBrowser();
    const pendingEndpoint = new Promise(() => {});

    await expect(waitForChrome({
      browser,
      executablePath: 'C:\\Chrome\\chrome.exe',
      port: 9222,
      timeoutMs: 10,
      fetchVersion: () => pendingEndpoint,
    })).rejects.toThrow(/reason=timeout.*browser_path=C:\\Chrome\\chrome\.exe/);

    expectListenersCleaned(browser);
  });

  test('fails immediately on early browser exit with bounded stderr diagnostics', async () => {
    const browser = makeBrowser();
    const wait = waitForChrome({
      browser,
      executablePath: 'C:\\Chrome\\chrome.exe',
      port: 9222,
      timeoutMs: 1000,
      stderrLimit: 32,
      fetchVersion: () => new Promise(() => {}),
    });
    browser.stderr.write(`discard-me-${'x'.repeat(40)}-stderr-tail`);
    browser.emit('exit', 7, 'SIGTERM');

    await expect(wait).rejects.toThrow(
      /reason=early_exit.*exit_code=7.*exit_signal=SIGTERM.*stderr_tail=x+-stderr-tail/
    );
    expectListenersCleaned(browser);
  });

  test('fails immediately on spawn error with error code and diagnostics', async () => {
    const browser = makeBrowser();
    const wait = waitForChrome({
      browser,
      executablePath: 'C:\\Missing\\chrome.exe',
      port: 9222,
      timeoutMs: 1000,
      fetchVersion: () => new Promise(() => {}),
    });
    const spawnError = new Error('spawn failed');
    spawnError.code = 'ENOENT';
    browser.emit('error', spawnError);

    await expect(wait).rejects.toThrow(
      /reason=spawn_error.*browser_path=C:\\Missing\\chrome\.exe.*spawn_error=spawn failed.*spawn_error_code=ENOENT/
    );
    expectListenersCleaned(browser);
  });
});
