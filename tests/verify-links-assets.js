/**
 * tests/verify-links-assets.js
 * Verifies local asset paths, in-page anchor targets, PDF resumes,
 * project entry completeness, and scans for placeholder copy/Lorem Ipsum.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
let passCount = 0;
let errorCount = 0;

function pass(msg) {
    console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
    passCount++;
}

function fail(msg, err = '') {
    console.error(`  \x1b[31m✗\x1b[0m ${msg} ${err ? `\n    ${err}` : ''}`);
    errorCount++;
}

console.log('\n\x1b[1m[3/4] Verifying Links, Asset Paths, and Content Integrity...\x1b[0m');

// 1. Check local assets referenced across HTML files
const htmlFiles = ['index.html', 'dxvalley-case-study.html'];

htmlFiles.forEach(file => {
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath)) return;

    const rawHtml = fs.readFileSync(fullPath, 'utf8');
    const dom = new JSDOM(rawHtml);
    const doc = dom.window.document;

    // Check images & picture sources
    const mediaElements = Array.from(doc.querySelectorAll('img[src], source[srcset]'));
    mediaElements.forEach(el => {
        const srcAttr = el.getAttribute('src') || el.getAttribute('srcset');
        if (!srcAttr) return;

        // Strip queries or hashes
        const cleanPath = srcAttr.split('?')[0].split('#')[0];
        if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://') || cleanPath.startsWith('data:')) {
            // External resource or data URI
            return;
        }

        const resolved = path.resolve(ROOT, cleanPath);
        if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
            pass(`Asset exists: ${cleanPath} (in ${file})`);
        } else {
            fail(`Asset missing on disk: ${cleanPath} (referenced in ${file})`);
        }
    });

    // Check stylesheets & local scripts
    const linksAndScripts = Array.from(doc.querySelectorAll('link[rel="stylesheet"][href], script[src]'));
    linksAndScripts.forEach(el => {
        const pathAttr = el.getAttribute('href') || el.getAttribute('src');
        if (!pathAttr) return;

        if (pathAttr.startsWith('http://') || pathAttr.startsWith('https://')) return;

        const cleanPath = pathAttr.split('?')[0].split('#')[0];
        const resolved = path.resolve(ROOT, cleanPath);
        if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
            pass(`Local resource exists: ${cleanPath} (in ${file})`);
        } else {
            fail(`Local resource missing on disk: ${cleanPath} (referenced in ${file})`);
        }
    });

    // Check in-page anchor links and local file links
    const anchors = Array.from(doc.querySelectorAll('a[href]'));
    anchors.forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href === '') {
            fail(`Empty href found in ${file}`);
            return;
        }

        if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
            fail(`Placeholder or javascript void link in ${file}: ${a.outerHTML.substring(0, 50)}`);
            return;
        }

        // In-page hash link
        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            if (targetId === 'top') {
                const hasTop = doc.body.id === 'top' || doc.querySelector('#top');
                if (hasTop) {
                    pass(`In-page anchor #${targetId} resolved (in ${file})`);
                } else {
                    fail(`In-page anchor #${targetId} has no matching ID target in ${file}`);
                }
            } else {
                const targetEl = doc.getElementById(targetId);
                if (targetEl) {
                    pass(`In-page anchor #${targetId} resolved (in ${file})`);
                } else {
                    fail(`In-page anchor #${targetId} has no matching target element in ${file}`);
                }
            }
            return;
        }

        // Relative HTML or Document link
        if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('data:')) {
            const [relPath, anchor] = href.split('#');
            const resolved = path.resolve(ROOT, relPath);
            if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
                pass(`Local link destination exists: ${relPath} (in ${file})`);
            } else {
                fail(`Broken local link destination: ${relPath} (referenced in ${file})`);
            }
        }
    });
});

// 2. Scan for placeholder text, Lorem Ipsum, and unfinished copy
const textFilesToScan = [
    'index.html',
    'dxvalley-case-study.html',
    'css/style.css',
    'js/script.js'
];

textFilesToScan.forEach(rel => {
    const fullPath = path.join(ROOT, rel);
    if (!fs.existsSync(fullPath)) return;

    const content = fs.readFileSync(fullPath, 'utf8');

    // Check for lorem ipsum
    if (/\blorem\s+ipsum\b/i.test(content)) {
        fail(`Lorem ipsum found in ${rel}`);
    } else {
        pass(`No Lorem Ipsum in ${rel}`);
    }

    // Check for "TODO" or "FIXME" comments
    const todoMatches = content.match(/\b(TODO|FIXME|XXX):/gi);
    if (todoMatches && todoMatches.length > 0) {
        fail(`Unresolved TODO/FIXME found in ${rel}: ${todoMatches.join(', ')}`);
    } else {
        pass(`No unresolved TODO/FIXME markers in ${rel}`);
    }
});

// 3. Verify Project Showcase Completeness (Projects 1 through 6)
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const indexDom = new JSDOM(indexHtml);
const projectCards = Array.from(indexDom.window.document.querySelectorAll('.portfolio-detail'));

if (projectCards.length === 6) {
    pass(`Portfolio showcase contains all 6 prioritized project cards`);
} else {
    fail(`Portfolio showcase expected 6 projects, found ${projectCards.length}`);
}

projectCards.forEach((card, i) => {
    const title = card.querySelector('h3')?.textContent.trim();
    const desc = card.querySelector('.project-desc')?.textContent.trim();
    const techTags = Array.from(card.querySelectorAll('.tech-tag'));
    const liveGithubLinks = Array.from(card.querySelectorAll('.live-github a, .live-github button'));

    if (title && title.length > 10) {
        pass(`Project ${i + 1} has descriptive title ("${title}")`);
    } else {
        fail(`Project ${i + 1} missing or short title`);
    }

    if (desc && desc.length > 40) {
        pass(`Project ${i + 1} has detailed problem/solution description (${desc.length} chars)`);
    } else {
        fail(`Project ${i + 1} missing detailed description`);
    }

    if (techTags.length >= 3) {
        pass(`Project ${i + 1} lists real technical stack (${techTags.map(t => t.textContent.trim()).join(', ')})`);
    } else {
        fail(`Project ${i + 1} has fewer than 3 tech tags`);
    }

    if (liveGithubLinks.length >= 1) {
        pass(`Project ${i + 1} has verified action link(s)`);
    } else {
        fail(`Project ${i + 1} has no action link or access button`);
    }
});

// 4. Verify Downloadable CV file exists and is readable
const resumePath = path.join(ROOT, 'assets', 'docs', 'Negaro_Manzir_Resume.pdf');
if (fs.existsSync(resumePath) && fs.statSync(resumePath).size > 1000) {
    pass(`Verified downloadable CV PDF exists at assets/docs/Negaro_Manzir_Resume.pdf (${Math.round(fs.statSync(resumePath).size / 1024)} KB)`);
} else {
    fail(`Downloadable CV PDF missing or empty at assets/docs/Negaro_Manzir_Resume.pdf`);
}

console.log(`\nSummary: ${passCount} passed, ${errorCount} failed.`);
process.exit(errorCount > 0 ? 1 : 0);
