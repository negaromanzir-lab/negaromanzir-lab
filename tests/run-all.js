/**
 * tests/run-all.js
 * Master Quality-Check Suite Runner for Negaro Manzir Portfolio.
 * Executes all 4 validation modules sequentially and reports unified test metrics.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const testSuites = [
    { name: 'JavaScript Syntax & JSON Integrity', file: 'lint-syntax.js' },
    { name: 'HTML5 Semantics & Accessibility Standards', file: 'validate-html.js' },
    { name: 'Asset Paths, Links & Content Integrity', file: 'verify-links-assets.js' },
    { name: 'Linux / Vercel Case-Sensitivity Verification', file: 'check-case-sensitivity.js' },
    { name: 'Interactive DOM & Behavioral Tests (JSDOM)', file: 'test-behavior.js' }
];

console.log('\n================================================================');
console.log('  🚀 RUNNING PORTFOLIO QUALITY-CHECK & VERIFICATION SUITE');
console.log('================================================================');

let failedSuites = [];

for (const suite of testSuites) {
    const scriptPath = path.join(__dirname, suite.file);
    const result = spawnSync(process.execPath, [scriptPath], {
        stdio: 'inherit'
    });

    if (result.status !== 0) {
        failedSuites.push(suite.name);
    }
}

console.log('\n================================================================');
if (failedSuites.length === 0) {
    console.log('  \x1b[32m\x1b[1m🎉 ALL QUALITY CHECKS PASSED SUCCESSFULLY (4/4 Suites Passed)\x1b[0m');
    console.log('  Ready for deployment to Vercel and production maintenance.');
    console.log('================================================================\n');
    process.exit(0);
} else {
    console.error(`  \x1b[31m\x1b[1m❌ ${failedSuites.length} OF ${testSuites.length} SUITES FAILED:\x1b[0m`);
    failedSuites.forEach(s => console.error(`    - ${s}`));
    console.log('================================================================\n');
    process.exit(1);
}
