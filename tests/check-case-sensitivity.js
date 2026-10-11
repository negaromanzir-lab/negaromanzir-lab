/**
 * tests/check-case-sensitivity.js
 * Verifies that all referenced asset and link paths match the exact case on disk.
 * Critical for Linux deployments (Vercel, Render) where file systems are case-sensitive.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
let mismatches = 0;

function checkExactCasing(relPath, sourceFile) {
    const clean = relPath.split('?')[0].split('#')[0];
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('mailto:') || clean.startsWith('tel:') || clean.startsWith('data:') || clean.startsWith('#')) {
        return;
    }

    const segments = clean.replace(/\\/g, '/').split('/').filter(Boolean);
    let currentDir = ROOT;

    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (!fs.existsSync(currentDir)) {
            console.error(`  \x1b[31m✗ Directory missing:\x1b[0m ${currentDir} (from ${clean} in ${sourceFile})`);
            mismatches++;
            return;
        }

        const entries = fs.readdirSync(currentDir);
        if (!entries.includes(seg)) {
            const foundInsensitive = entries.find(e => e.toLowerCase() === seg.toLowerCase());
            if (foundInsensitive) {
                console.error(`  \x1b[31m✗ Case mismatch:\x1b[0m referenced "${seg}" but disk has "${foundInsensitive}" (path: ${clean} in ${sourceFile})`);
            } else {
                console.error(`  \x1b[31m✗ File missing on disk:\x1b[0m "${seg}" in "${currentDir}" (path: ${clean} in ${sourceFile})`);
            }
            mismatches++;
            return;
        }
        currentDir = path.join(currentDir, seg);
    }
}

console.log('\n\x1b[1mChecking Exact Asset Case Sensitivity for Linux/Vercel Deployment...\x1b[0m');

const htmlFiles = ['index.html', 'dxvalley-case-study.html'];
htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const dom = new JSDOM(content);
    const doc = dom.window.document;

    // Check all img, source, link, script, a tags
    doc.querySelectorAll('img[src]').forEach(el => checkExactCasing(el.getAttribute('src'), file));
    doc.querySelectorAll('source[srcset]').forEach(el => checkExactCasing(el.getAttribute('srcset'), file));
    doc.querySelectorAll('link[href]').forEach(el => checkExactCasing(el.getAttribute('href'), file));
    doc.querySelectorAll('script[src]').forEach(el => checkExactCasing(el.getAttribute('src'), file));
    doc.querySelectorAll('a[href]').forEach(el => checkExactCasing(el.getAttribute('href'), file));
});

// Also check dataset attributes like data-cert in index.html
const indexContent = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const indexDom = new JSDOM(indexContent);
indexDom.window.document.querySelectorAll('[data-cert]').forEach(el => {
    checkExactCasing(el.getAttribute('data-cert'), 'index.html[data-cert]');
});

if (mismatches === 0) {
    console.log('  \x1b[32m✓ All referenced paths match disk casing exactly. 0 case mismatches found.\x1b[0m\n');
    process.exit(0);
} else {
    console.error(`  \x1b[31m✗ Found ${mismatches} casing or missing file error(s).\x1b[0m\n`);
    process.exit(1);
}
