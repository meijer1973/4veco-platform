#!/usr/bin/env node
/**
 * post-push-hook.js — Claude Code PostToolUse hook for Bash.
 * Reads hook stdin JSON. If the command was `git push`, runs deployment verification.
 * Exits silently for non-push commands.
 */
const { execSync } = require('child_process');
const path = require('path');

let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
    try {
        const input = JSON.parse(data);
        const cmd = (input.tool_input && input.tool_input.command) || '';

        // Only act on git push commands
        if (!/^git push/.test(cmd)) {
            process.exit(0);
        }

        const projectDir = path.resolve(__dirname, '..');

        console.error('Verifying GitHub Pages deployment...');
        try {
            execSync('bash scripts/verify-deployment.sh', { cwd: projectDir, stdio: 'inherit', timeout: 180000 });
        } catch (e) {
            // Report failure but don't block (push already happened)
            console.log(JSON.stringify({
                hookSpecificOutput: {
                    hookEventName: "PostToolUse",
                    additionalContext: "WARNING: Deployment verification failed. The site may not be live yet. Check https://meijer1973.github.io/economie-vwo4-m3/ manually."
                }
            }));
        }
    } catch (e) {
        process.exit(0);
    }
});
