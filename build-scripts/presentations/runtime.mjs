import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';

// Discover these paths through the installed presentation skill/runtime.
// Keep personal caches and version numbers out of paragraph authoring sources.
for (const key of ['RUNTIME_NODE_MODULES', 'RUNTIME_PYTHON', 'SKILL_DIR']) {
  if (!path.isAbsolute(process.env[key] || '')) {
    throw new Error(`Set ${key} to the absolute path supplied by the installed presentation runtime.`);
  }
}
export const PYTHON = process.env.RUNTIME_PYTHON;
export const SKILL = process.env.SKILL_DIR;
export const TOOLS = path.dirname(fileURLToPath(import.meta.url));
export const PLATFORM = path.resolve(TOOLS, '../..');
const require = createRequire(path.join(process.env.RUNTIME_NODE_MODULES, '_presentation-loader.cjs'));
export const {Presentation, PresentationFile} = await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
export const {finalizePresentation, applyPresentationChartFont} = await import(
  pathToFileURL(path.join(SKILL, 'container_tools/artifact_tool_utils.mjs')).href
);

export async function workspace(id) {
  const root = process.env.PRESENTATION_WORKSPACE || path.join(PLATFORM, 'output', `presentation-${id}`);
  if (!path.isAbsolute(root)) throw new Error('PRESENTATION_WORKSPACE must be absolute.');
  const build = path.join(root, 'build');
  const final = path.join(root, 'final');
  await fs.mkdir(build, {recursive:true});
  await fs.mkdir(final, {recursive:true});
  return {root, build, final};
}
