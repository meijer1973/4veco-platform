"use strict";

const { spawnSync } = require("child_process");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args, env = {}) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, ...env },
    windowsHide: true,
  });
}

describe("selected jurisdiction deepening checker", () => {
  test("accepts committed selected-jurisdiction deepening packet", () => {
    const result = runNode(["build-scripts/inspection/check-selected-jurisdiction-deepening.js"], {
      SELECTED_DEEPENING_CHECK_COMMITTED_OUTPUTS: "1",
    });
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK selected jurisdiction deepening check");
  });

  test("refuses forbidden selected-jurisdiction output modes", () => {
    const publicResult = runNode(["build-scripts/inspection/build-selected-jurisdiction-deepening.js", "--public"]);
    expect(publicResult.status).toBe(1);
    expect(`${publicResult.stdout}\n${publicResult.stderr}`).toContain("STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT");

    const productResult = runNode(["build-scripts/inspection/build-selected-jurisdiction-deepening.js", "--product-route"]);
    expect(productResult.status).toBe(1);
    expect(`${productResult.stdout}\n${productResult.stderr}`).toContain("STOP_DOWNSTREAM_AUTHORITY");

    const legalResult = runNode(["build-scripts/inspection/build-selected-jurisdiction-deepening.js", "--legal-sufficiency"]);
    expect(legalResult.status).toBe(1);
    expect(`${legalResult.stdout}\n${legalResult.stderr}`).toContain("STOP_COMPLIANCE_APPROVAL_CLAIM");
  });
});
