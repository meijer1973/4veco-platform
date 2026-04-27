#!/usr/bin/env node
/**
 * validate-alignment-graph.js
 *
 * Stable command name for validating the governed alignment graph.
 * Delegates to check-alignment-graph.js, which also refreshes integrity reports.
 */

const { main } = require('./check-alignment-graph');

main();
