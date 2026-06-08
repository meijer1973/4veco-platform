#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const boundary = require('./check-golden-ticket-layout-boundary');

function fail(message) {
  throw new Error(message);
}

function normalize(file) {
  return path.relative(path.resolve(__dirname, '..', '..'), file).replace(/\\/g, '/');
}

function parseArgs(argv) {
  const args = {
    target: null,
    expectFail: false,
    bookRoot: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--expect-fail') {
      args.expectFail = true;
    } else if (arg === '--book-root') {
      args.bookRoot = path.resolve(argv[i + 1]);
      i += 1;
    } else if (arg === '--fixture') {
      args.target = path.resolve(argv[i + 1]);
      i += 1;
    } else if (!arg.startsWith('--') && !args.target) {
      args.target = path.resolve(arg);
    }
  }
  return args;
}

function readTarget(args) {
  if (args.target) {
    if (!fs.existsSync(args.target)) fail(`missing file: ${args.target}`);
    return {
      file: args.target,
      html: fs.readFileSync(args.target, 'utf8'),
    };
  }
  const file = args.bookRoot
    ? boundary.findGeneratedExitPage(args.bookRoot)
    : boundary.findGeneratedExitPage();
  return {
    file,
    html: fs.readFileSync(file, 'utf8'),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const target = readTarget(args);
  try {
    const result = boundary.checkHtml(target.html, { label: normalize(target.file) });
    if (args.expectFail) {
      console.error('Expected no-legacy checker to fail, but it passed.');
      process.exit(1);
    }
    console.log(JSON.stringify({
      ok: true,
      checked: normalize(target.file),
      result,
    }, null, 2));
  } catch (error) {
    if (args.expectFail) {
      console.log(JSON.stringify({
        ok: true,
        expected_failure: true,
        checked: normalize(target.file),
        errors: error.errors || [error.message],
      }, null, 2));
      return;
    }
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  readTarget,
  checkHtml: boundary.checkHtml,
};
