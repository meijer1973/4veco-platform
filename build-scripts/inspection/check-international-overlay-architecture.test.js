"use strict";

const { spawnSync } = require("child_process");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

describe("international overlay architecture checker", () => {
  test("accepts the generated overlay descriptor architecture packet", () => {
    const result = runNode(["build-scripts/inspection/check-international-overlay-architecture.js"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("OK international overlay architecture check");
  });

  test("refuses forbidden public or country-edition generator modes", () => {
    const publicResult = runNode(["build-scripts/inspection/build-international-overlay-architecture.js", "--public"]);
    expect(publicResult.status).toBe(1);
    expect(`${publicResult.stdout}\n${publicResult.stderr}`).toContain("STOP_FORBIDDEN_AUDIENCE");

    const editionResult = runNode(["build-scripts/inspection/build-international-overlay-architecture.js", "--country-edition"]);
    expect(editionResult.status).toBe(1);
    expect(`${editionResult.stdout}\n${editionResult.stderr}`).toContain("STOP_COMPLIANCE_APPROVAL_CLAIM");
  });
});
