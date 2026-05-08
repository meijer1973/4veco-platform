const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const platformRoot = path.resolve(__dirname, "..", "..");
const lessenRoot = path.resolve(platformRoot, "..", "4veco-lessen");
const reportsDir = path.join(platformRoot, "reports");

const skipDirs = new Set([
  ".git",
  "node_modules",
  ".cache",
  ".tmp",
  "tmp",
  "temp",
  "dist",
  "coverage",
  "out",
  "output",
  "outputs",
  "__pycache__",
]);

const GROUPS = [
  "maps/prompts",
  "agents",
  "engines",
  "build scripts",
  "skills",
  "validators",
  "references",
  "reports",
  "book folders",
  "paragraph folders",
  "generated artifacts",
  "other",
];

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function isParagraphPath(relativePath) {
  return /(^|\/)\d+\.\d+\.\d+ [^/]+(\/|$)/.test(relativePath);
}

function isBookPath(relativePath) {
  return /(^|\/)Boek \d+ - [^/]+(\/|$)/.test(relativePath);
}

function isGeneratedArtifact(relativePath) {
  const lower = relativePath.toLowerCase();
  const artifactExtension = /\.(md|html|pdf|docx|pptx|png|jpg|jpeg|webp|svg|yaml|yml)$/.test(lower);
  const sharedData = /\/shared\/(questions|reasoning|skilltree|procedure|newsdetective)\//.test(relativePath);
  return (artifactExtension && (isBookPath(relativePath) || isParagraphPath(relativePath))) || sharedData;
}

function isEnginePath(relativePath) {
  return (
    relativePath.startsWith("engines/") ||
    /\/shared\/(theme|voorkennis|quiz|reasoning|skilltree|newsdetective|procedure)(-|\.|\/)/.test(relativePath)
  );
}

function classifyGroups(relativePath) {
  const basename = path.posix.basename(relativePath);
  const lower = relativePath.toLowerCase();
  const groups = [];

  if (
    /^research_agent_(map|prompt).*\.md$/i.test(basename) ||
    basename === "AGENTS.md" ||
    basename === "AGENT_GITHUB_ENTRY.md" ||
    lower.includes("/qc-prompts/")
  ) {
    groups.push("maps/prompts");
  }

  if (relativePath.startsWith("agents/")) groups.push("agents");
  if (isEnginePath(relativePath)) groups.push("engines");
  if (relativePath.startsWith("build-scripts/") || relativePath.startsWith("scripts/")) groups.push("build scripts");
  if (relativePath.startsWith("skills/") || relativePath.startsWith(".claude/commands/")) groups.push("skills");
  if (lower.includes("validat") || lower.includes("validator") || lower.includes("check-")) groups.push("validators");
  if (relativePath.startsWith("references/")) groups.push("references");
  if (relativePath.startsWith("reports/")) groups.push("reports");
  if (isBookPath(relativePath)) groups.push("book folders");
  if (isParagraphPath(relativePath)) groups.push("paragraph folders");
  if (isGeneratedArtifact(relativePath)) groups.push("generated artifacts");

  return groups.length > 0 ? groups : ["other"];
}

function walk(root, current = root, files = []) {
  const entries = fs.readdirSync(current, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;

    const absolutePath = path.join(current, entry.name);
    if (entry.isDirectory()) {
      walk(root, absolutePath, files);
      continue;
    }

    if (!entry.isFile()) continue;
    files.push(toPosix(path.relative(root, absolutePath)));
  }

  return files;
}

function listFiles(root) {
  try {
    const output = execFileSync("git", ["ls-files", "--cached"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((file) => !file.split("/").some((part) => skipDirs.has(part)))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    return walk(root).sort((a, b) => a.localeCompare(b));
  }
}

function emptyGroups() {
  return Object.fromEntries(GROUPS.map((group) => [group, []]));
}

function buildIndex(repoName, root) {
  if (!fs.existsSync(root)) {
    return {
      repo: repoName,
      root,
      available: false,
      generated_at: new Date().toISOString(),
      note: `${root} is unavailable; no file inventory was generated for this repository.`,
      groups: emptyGroups(),
    };
  }

  const files = listFiles(root);
  const groups = emptyGroups();

  for (const file of files) {
    for (const group of classifyGroups(file)) {
      groups[group].push(file);
    }
  }

  return {
    repo: repoName,
    root,
    available: true,
    generated_at: new Date().toISOString(),
    file_count: files.length,
    inventory_scope: "git-indexed files from `git ls-files --cached`; falls back to filesystem scan outside git worktrees",
    skipped_directories: Array.from(skipDirs).sort(),
    groups,
  };
}

function writeJson(fileName, data) {
  fs.writeFileSync(path.join(reportsDir, fileName), `${JSON.stringify(data, null, 2)}\n`);
}

function writeMarkdown(fileName, data) {
  const lines = [];
  lines.push(`# GitHub Agent File Index - ${data.repo}`);
  lines.push("");
  lines.push(`Generated: ${data.generated_at}`);
  lines.push("");
  lines.push("Purpose: lightweight orientation for agents browsing through GitHub. This inventory lists files by repository surface; it is not a Book 1 status system and does not certify lesson completeness.");
  lines.push("");

  if (!data.available) {
    lines.push(`Unavailable: ${data.note}`);
    lines.push("");
    fs.writeFileSync(path.join(reportsDir, fileName), `${lines.join("\n")}\n`);
    return;
  }

  lines.push(`Root: \`${data.root}\``);
  lines.push(`Files indexed: ${data.file_count}`);
  lines.push(`Scope: ${data.inventory_scope}`);
  lines.push("");
  lines.push("Skipped directories: " + data.skipped_directories.map((item) => `\`${item}\``).join(", "));
  lines.push("");

  for (const group of GROUPS) {
    const files = data.groups[group];
    lines.push(`## ${group}`);
    lines.push("");
    lines.push(`Count: ${files.length}`);
    lines.push("");

    if (files.length === 0) {
      lines.push("_No files indexed in this group._");
      lines.push("");
      continue;
    }

    for (const file of files) {
      lines.push(`- ${file}`);
    }
    lines.push("");
  }

  fs.writeFileSync(path.join(reportsDir, fileName), `${lines.join("\n")}\n`);
}

function main() {
  fs.mkdirSync(reportsDir, { recursive: true });

  const platform = buildIndex("4veco-platform", platformRoot);
  const lessen = buildIndex("4veco-lessen", lessenRoot);

  writeJson("github-agent-index-platform.json", platform);
  writeMarkdown("github-agent-index-platform.md", platform);
  writeJson("github-agent-index-lessen.json", lessen);
  writeMarkdown("github-agent-index-lessen.md", lessen);

  console.log(`Wrote ${path.join("reports", "github-agent-index-platform.md")}`);
  console.log(`Wrote ${path.join("reports", "github-agent-index-platform.json")}`);
  console.log(`Wrote ${path.join("reports", "github-agent-index-lessen.md")}`);
  console.log(`Wrote ${path.join("reports", "github-agent-index-lessen.json")}`);

  if (!lessen.available) {
    console.log(`4veco-lessen unavailable at ${lessenRoot}`);
  }
}

main();
