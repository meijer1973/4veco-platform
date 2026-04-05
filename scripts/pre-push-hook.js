#!/usr/bin/env node
/**
 * pre-push-hook.js — Claude Code PreToolUse hook for Bash.
 * Reads hook stdin JSON. If the command is `git push`, runs tests + link checker.
 * Outputs JSON to block the push if checks fail. Exits silently for non-push commands.
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
            process.exit(0); // Silent pass-through
        }

        const projectDir = path.resolve(__dirname, '..');
        let failed = false;

        // Run Jest tests
        try {
            console.error('Running pre-push tests...');
            execSync('npx jest --no-cache', { cwd: projectDir, stdio: 'inherit', timeout: 60000 });
        } catch (e) {
            failed = true;
        }

        // Run link checker
        if (!failed) {
            try {
                console.error('Running link checker...');
                execSync('node scripts/check-links.js', { cwd: projectDir, stdio: 'inherit', timeout: 30000 });
            } catch (e) {
                failed = true;
            }
        }

        if (failed) {
            // Output JSON to block the push
            console.log(JSON.stringify({
                hookSpecificOutput: {
                    hookEventName: "PreToolUse",
                    permissionDecision: "deny",
                    permissionDecisionReason: "Pre-push checks failed. Fix test or link errors before pushing."
                }
            }));
        }
        // If not failed, no output = allow
    } catch (e) {
        // Parse error or unexpected issue — don't block
        process.exit(0);
    }
});
