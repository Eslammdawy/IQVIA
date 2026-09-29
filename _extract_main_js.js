// Extracts the last inline <script> (the dashboard IIFE) from the generated
// HTML into _main_js_check.js so it can be syntax-checked with `node --check`.
const fs = require('fs');
const html = fs.readFileSync('IQVIA_MAT_Jul_Dashboard.html', 'utf8');

const matches = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)];
if (matches.length === 0) { console.error('No inline scripts found'); process.exit(1); }
const main = matches[matches.length - 1][1];
fs.writeFileSync('_main_js_check.js', main);
console.log('Extracted main script:', main.length, 'chars from', matches.length, 'inline script block(s)');
