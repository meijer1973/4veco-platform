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

describe("internal overlay prototype planning checker", () => {
  test("accepts committed internal overlay prototype planning packet", () => {
    const result = runNode(["build-scripts/inspection/check-internal-overlay-prototype-planning.js"], {
      INTERNAL_OVERLAY_PROTOTYPE_PLANNING_CHECK_COMMITTED_OUTPUTS: "1",
    });
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK internal overlay prototype planning check");
  });

  test("refuses forbidden internal overlay prototype planning modes", () => {
    const publicResult = runNode(["build-scripts/inspection/build-internal-overlay-prototype-planning.js", "--public"]);
    expect(publicResult.status).toBe(1);
    expect(`${publicResult.stdout}\n${publicResult.stderr}`).toContain("STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT");

    const runtimeResult = runNode(["build-scripts/inspection/build-internal-overlay-prototype-planning.js", "--execute-prototype"]);
    expect(runtimeResult.status).toBe(1);
    expect(`${runtimeResult.stdout}\n${runtimeResult.stderr}`).toContain("STOP_FORBIDDEN_RUNTIME");

    const productResult = runNode(["build-scripts/inspection/build-internal-overlay-prototype-planning.js", "--product-route"]);
    expect(productResult.status).toBe(1);
    expect(`${productResult.stdout}\n${productResult.stderr}`).toContain("STOP_DOWNSTREAM_AUTHORITY");

    const legalResult = runNode(["build-scripts/inspection/build-internal-overlay-prototype-planning.js", "--legal-sufficiency"]);
    expect(legalResult.status).toBe(1);
    expect(`${legalResult.stdout}\n${legalResult.stderr}`).toContain("STOP_COMPLIANCE_APPROVAL_CLAIM");

    const supportResult = runNode(["build-scripts/inspection/build-internal-overlay-prototype-planning.js", "--support-sufficiency"]);
    expect(supportResult.status).toBe(1);
    expect(`${supportResult.stdout}\n${supportResult.stderr}`).toContain("STOP_SUPPORT_ACCOMMODATION_CLAIM");

    const accommodationResult = runNode(["build-scripts/inspection/build-internal-overlay-prototype-planning.js", "--accommodation-sufficiency"]);
    expect(accommodationResult.status).toBe(1);
    expect(`${accommodationResult.stdout}\n${accommodationResult.stderr}`).toContain("STOP_SUPPORT_ACCOMMODATION_CLAIM");
  });
});
