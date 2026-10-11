/**
 * tests/lint-syntax.js
 * Validates syntax, JSON formatting, and configuration integrity across the repository.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
let errorCount = 0;
let passCount = 0;

function pass(msg) {
    console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
    passCount++;
}

function fail(msg, err = '') {
    console.error(`  \x1b[31m✗\x1b[0m ${msg} ${err ? `\n    ${err}` : ''}`);
    errorCount++;
}

console.log('\n\x1b[1m[1/4] Checking JavaScript Syntax & JSON/Config Integrity...\x1b[0m');

// 1. JavaScript Files Syntax Check
const jsFiles = [
    'js/script.js',
    'generate_resume.js'
];

jsFiles.forEach(file => {
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath)) {
        fail(`File missing: ${file}`);
        return;
    }
    try {
        const code = fs.readFileSync(fullPath, 'utf8');
        new vm.Script(code, { filename: file });
        pass(`Syntax valid: ${file}`);
    } catch (e) {
        fail(`Syntax error in ${file}`, e.message);
    }
});

// 2. JSON Files Formatting Check
const jsonFiles = [
    'package.json',
    'vercel.json'
];

jsonFiles.forEach(file => {
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath)) {
        fail(`File missing: ${file}`);
        return;
    }
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        JSON.parse(content);
        pass(`JSON valid: ${file}`);
    } catch (e) {
        fail(`JSON parse error in ${file}`, e.message);
    }
});

// 3. Sitemap & Robots Configuration Check
const sitemapPath = path.join(ROOT, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    if (sitemapContent.includes('<?xml') && sitemapContent.includes('<urlset') && sitemapContent.includes('</urlset>')) {
        pass('sitemap.xml has valid XML structure');
    } else {
        fail('sitemap.xml missing required XML urlset tags');
    }
} else {
    fail('sitemap.xml missing');
}

const robotsPath = path.join(ROOT, 'robots.txt');
if (fs.existsSync(robotsPath)) {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    if (robotsContent.includes('User-agent:') && robotsContent.includes('Sitemap:')) {
        pass('robots.txt has User-agent and Sitemap directives');
    } else {
        fail('robots.txt missing User-agent or Sitemap directives');
    }
} else {
    fail('robots.txt missing');
}

console.log(`\nSummary: ${passCount} passed, ${errorCount} failed.`);
process.exit(errorCount > 0 ? 1 : 0);
