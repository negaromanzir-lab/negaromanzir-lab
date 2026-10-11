/**
 * tests/validate-html.js
 * Validates HTML semantics, heading hierarchy, unique IDs, accessibility attributes,
 * and meta standards for index.html and dxvalley-case-study.html.
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

console.log('\n\x1b[1m[2/4] Validating HTML Markup, Semantics & Accessibility Standards...\x1b[0m');

const htmlFiles = ['index.html', 'dxvalley-case-study.html'];

htmlFiles.forEach(file => {
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath)) {
        fail(`HTML file missing: ${file}`);
        return;
    }

    console.log(`\n  \x1b[34mEvaluating ${file}:\x1b[0m`);
    const rawHtml = fs.readFileSync(fullPath, 'utf8');

    // 1. DOCTYPE check
    if (/^\s*<!DOCTYPE\s+html>/i.test(rawHtml)) {
        pass(`${file} includes standard <!DOCTYPE html>`);
    } else {
        fail(`${file} missing <!DOCTYPE html> at start`);
    }

    const dom = new JSDOM(rawHtml);
    const doc = dom.window.document;

    // 2. Language attribute on <html>
    const lang = doc.documentElement.getAttribute('lang');
    if (lang && lang.trim().length > 0) {
        pass(`${file} specifies lang attribute ('${lang}')`);
    } else {
        fail(`${file} <html> element missing lang attribute`);
    }

    // 3. Head metadata checks
    const charset = doc.querySelector('meta[charset]');
    if (charset) {
        pass(`${file} includes meta charset`);
    } else {
        fail(`${file} missing meta charset`);
    }

    const viewport = doc.querySelector('meta[name="viewport"]');
    if (viewport && viewport.getAttribute('content')) {
        pass(`${file} includes responsive viewport meta tag`);
    } else {
        fail(`${file} missing responsive viewport meta tag`);
    }

    const title = doc.querySelector('title');
    if (title && title.textContent.trim().length > 5) {
        pass(`${file} has descriptive title ("${title.textContent.trim()}")`);
    } else {
        fail(`${file} missing or empty <title> tag`);
    }

    const description = doc.querySelector('meta[name="description"]');
    if (description && description.getAttribute('content')?.trim().length > 15) {
        pass(`${file} has descriptive meta description`);
    } else {
        fail(`${file} missing or short meta description`);
    }

    const canonical = doc.querySelector('link[rel="canonical"]');
    if (canonical && canonical.getAttribute('href')?.startsWith('https://')) {
        pass(`${file} specifies canonical URL ('${canonical.getAttribute('href')}')`);
    } else {
        fail(`${file} missing or non-https canonical link`);
    }

    // 4. Skip navigation link
    const skipLink = doc.querySelector('a.skip-link');
    if (skipLink && skipLink.getAttribute('href') === '#main-content') {
        const targetMain = doc.querySelector('#main-content');
        if (targetMain) {
            pass(`${file} contains functional skip-to-content link targeted at #main-content`);
        } else {
            fail(`${file} skip link points to #main-content but target #main-content element is missing`);
        }
    } else {
        fail(`${file} missing accessible skip navigation link (<a class="skip-link" href="#main-content">)`);
    }

    // 5. Unique Element IDs Check
    const elementsWithId = doc.querySelectorAll('[id]');
    const seenIds = new Set();
    const duplicateIds = [];
    elementsWithId.forEach(el => {
        const id = el.id.trim();
        if (seenIds.has(id)) {
            duplicateIds.push(id);
        } else {
            seenIds.add(id);
        }
    });
    if (duplicateIds.length === 0) {
        pass(`${file} has 0 duplicate IDs across ${seenIds.size} identified elements`);
    } else {
        fail(`${file} contains duplicate IDs: ${duplicateIds.join(', ')}`);
    }

    // 6. Heading Order & Hierarchy Validation
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    if (headings.length === 0) {
        fail(`${file} has no heading elements`);
    } else {
        const h1List = headings.filter(h => h.tagName.toLowerCase() === 'h1');
        if (h1List.length === 1) {
            pass(`${file} has exactly one <h1> element ("${h1List[0].textContent.trim()}")`);
        } else {
            fail(`${file} should have exactly one <h1>, found ${h1List.length}`);
        }

        // Verify sequential levels (no skipped levels, e.g. h1 -> h3)
        let lastLevel = 1;
        let headingOrderValid = true;
        let violationInfo = '';

        for (let i = 0; i < headings.length; i++) {
            const h = headings[i];
            const currentLevel = parseInt(h.tagName.substring(1), 10);
            if (i === 0 && currentLevel !== 1) {
                headingOrderValid = false;
                violationInfo = `First heading is h${currentLevel} instead of h1`;
                break;
            }
            if (currentLevel > lastLevel + 1) {
                headingOrderValid = false;
                violationInfo = `Heading jumps from h${lastLevel} directly to h${currentLevel} ("${h.textContent.trim().substring(0, 30)}")`;
                break;
            }
            lastLevel = currentLevel;
        }

        if (headingOrderValid) {
            pass(`${file} heading hierarchy is strictly sequential (no skipped levels)`);
        } else {
            fail(`${file} heading hierarchy violation: ${violationInfo}`);
        }
    }

    // 7. Image Accessibility (alt attribute, dimensions)
    const images = Array.from(doc.querySelectorAll('img'));
    let missingAlt = 0;
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            missingAlt++;
        }
    });

    if (missingAlt === 0) {
        pass(`${file} all ${images.length} <img> elements have alt attributes`);
    } else {
        fail(`${file} has ${missingAlt} <img> elements missing alt attribute`);
    }

    // 8. Interactive Elements & Form Accessibility
    const buttons = Array.from(doc.querySelectorAll('button'));
    let unlabelledButtons = 0;
    buttons.forEach(btn => {
        const text = btn.textContent.trim();
        const ariaLabel = btn.getAttribute('aria-label');
        const ariaLabelledby = btn.getAttribute('aria-labelledby');
        if (!text && !ariaLabel && !ariaLabelledby) {
            unlabelledButtons++;
        }
    });
    if (unlabelledButtons === 0) {
        pass(`${file} all ${buttons.length} <button> elements have accessible names`);
    } else {
        fail(`${file} has ${unlabelledButtons} <button> elements missing accessible text or aria-label`);
    }

    const formInputs = Array.from(doc.querySelectorAll('input:not([type="hidden"]), textarea, select'));
    let unlabelledInputs = 0;
    formInputs.forEach(input => {
        const id = input.id;
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledby = input.getAttribute('aria-labelledby');
        const label = id ? doc.querySelector(`label[for="${id}"]`) : null;
        if (!label && !ariaLabel && !ariaLabelledby) {
            unlabelledInputs++;
        }
    });
    if (unlabelledInputs === 0) {
        pass(`${file} all ${formInputs.length} visible form inputs have associated labels or aria-label`);
    } else {
        fail(`${file} has ${unlabelledInputs} form inputs without labels`);
    }
});

console.log(`\nSummary: ${passCount} passed, ${errorCount} failed.`);
process.exit(errorCount > 0 ? 1 : 0);
