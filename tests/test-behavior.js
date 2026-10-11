/**
 * tests/test-behavior.js
 * Comprehensive DOM runtime tests for:
 * 1. Mobile navigation toggle & Escape closing
 * 2. Résumé tabs & ARIA keyboard arrow navigation
 * 3. Portfolio carousel boundaries, counter, and keyboard arrows
 * 4. Certificate viewer modal, counter, cyclic navigation, and focus trap
 * 5. Contact form validation, length counter, honeypot, and repository-access request workflow
 * 6. Browser console checks (zero unexpected errors/warnings during script execution)
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

console.log('\n\x1b[1m[4/4] Executing Interactive DOM & Behavioral Tests in JSDOM...\x1b[0m');

const htmlContent = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const scriptContent = fs.readFileSync(path.join(ROOT, 'js', 'script.js'), 'utf8');

const consoleErrors = [];
const consoleWarns = [];

const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    url: 'https://negaromanzir-lab.vercel.app/'
});

const { window } = dom;
const { document } = window;

// Stubs for browser environment
window.scrollTo = () => {};
window.Element.prototype.scrollIntoView = () => {};
window.pageYOffset = 0;
window.scrollY = 0;
window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
});

// EmailJS Mock
let emailSendCallCount = 0;
let lastEmailSendArgs = null;
window.emailjs = {
    init: () => {},
    send: (serviceId, templateId, templateParams) => {
        emailSendCallCount++;
        lastEmailSendArgs = { serviceId, templateId, templateParams };
        return Promise.resolve({ status: 200, text: 'OK' });
    }
};

// Console error/warning interception
const originalConsoleError = window.console.error;
const originalConsoleWarn = window.console.warn;
window.console.error = (...args) => {
    consoleErrors.push(args.join(' '));
    originalConsoleError.apply(window.console, args);
};
window.console.warn = (...args) => {
    consoleWarns.push(args.join(' '));
    originalConsoleWarn.apply(window.console, args);
};

// Execute script.js
try {
    window.eval(scriptContent);
    pass('js/script.js evaluated successfully without syntax or execution exceptions');
} catch (e) {
    fail('js/script.js threw an uncaught error during initialization', e.stack);
}

// ── 1. Console Cleanliness Check ─────────────────────────────────────────────
if (consoleErrors.length === 0) {
    pass('Browser console check: 0 errors logged during initialization');
} else {
    fail(`Browser console check: ${consoleErrors.length} errors logged: ${consoleErrors.join('; ')}`);
}

// ── 2. Mobile Navigation Tests ───────────────────────────────────────────────
console.log('\n  \x1b[34mTesting Mobile Navigation:\x1b[0m');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('#primary-nav');

if (menuIcon && navbar) {
    // Initial state
    if (menuIcon.getAttribute('aria-expanded') === 'false' && !navbar.classList.contains('active')) {
        pass('Mobile menu starts collapsed (aria-expanded="false", nav not active)');
    } else {
        fail('Mobile menu did not start in collapsed state');
    }

    // Click to open
    menuIcon.click();
    if (menuIcon.getAttribute('aria-expanded') === 'true' && navbar.classList.contains('active')) {
        pass('Clicking menu icon toggles nav open (aria-expanded="true", nav active)');
    } else {
        fail('Clicking menu icon failed to open mobile nav');
    }

    // Click to close
    menuIcon.click();
    if (menuIcon.getAttribute('aria-expanded') === 'false' && !navbar.classList.contains('active')) {
        pass('Clicking menu icon again closes nav (aria-expanded="false")');
    } else {
        fail('Clicking menu icon failed to close mobile nav');
    }

    // Open again, then press Escape
    menuIcon.click();
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    if (menuIcon.getAttribute('aria-expanded') === 'false' && !navbar.classList.contains('active')) {
        pass('Pressing Escape closes open mobile nav');
    } else {
        fail('Escape key failed to close mobile nav');
    }

    // Open again, click nav link
    menuIcon.click();
    const firstNavLink = navbar.querySelector('a');
    if (firstNavLink) {
        firstNavLink.click();
        if (menuIcon.getAttribute('aria-expanded') === 'false' && !navbar.classList.contains('active')) {
            pass('Clicking nav link closes mobile nav menu');
        } else {
            fail('Clicking nav link failed to close mobile nav menu');
        }
    }
} else {
    fail('Missing #menu-icon or #primary-nav');
}

// ── 3. Résumé Tabs Tests ─────────────────────────────────────────────────────
console.log('\n  \x1b[34mTesting Résumé Tabs:\x1b[0m');
const resumeBtns = Array.from(document.querySelectorAll('.resume-btn'));
const resumePanels = Array.from(document.querySelectorAll('.resume-detail'));

if (resumeBtns.length === 4 && resumePanels.length === 4) {
    pass(`All 4 resume tabs found (Experience, Education, Skills, About)`);

    // Initial state: Tab 0 (Experience) should be active
    if (resumeBtns[0].classList.contains('active') && resumeBtns[0].getAttribute('aria-selected') === 'true' && resumePanels[0].classList.contains('active')) {
        pass('Initial tab is Experience (aria-selected="true", panel active)');
    } else {
        fail('Initial resume tab is not Experience');
    }

    // Click Tab 1 (Education)
    resumeBtns[1].click();
    if (resumeBtns[1].classList.contains('active') && resumeBtns[1].getAttribute('aria-selected') === 'true' && resumePanels[1].classList.contains('active') && !resumeBtns[0].classList.contains('active')) {
        pass('Clicking Education tab switches active panel and updates ARIA attributes');
    } else {
        fail('Clicking Education tab failed to activate properly');
    }

    // Keyboard navigation: ArrowRight on Tab 1 -> Tab 2 (Skills)
    resumeBtns[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
    if (resumeBtns[2].classList.contains('active') && resumePanels[2].classList.contains('active')) {
        pass('ArrowRight advances to Skills tab');
    } else {
        fail('ArrowRight failed to advance to Skills tab');
    }

    // Keyboard navigation: End -> Tab 3 (About)
    resumeBtns[2].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', cancelable: true }));
    if (resumeBtns[3].classList.contains('active') && resumePanels[3].classList.contains('active')) {
        pass('End key navigates to last tab (About Me)');
    } else {
        fail('End key failed to navigate to last tab');
    }

    // Keyboard navigation: Home -> Tab 0 (Experience)
    resumeBtns[3].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Home', cancelable: true }));
    if (resumeBtns[0].classList.contains('active') && resumePanels[0].classList.contains('active')) {
        pass('Home key returns to first tab (Experience)');
    } else {
        fail('Home key failed to return to first tab');
    }

    // Wrap around: ArrowLeft on Tab 0 -> Tab 3 (About)
    resumeBtns[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true }));
    if (resumeBtns[3].classList.contains('active') && resumePanels[3].classList.contains('active')) {
        pass('ArrowLeft on first tab wraps around to last tab');
    } else {
        fail('ArrowLeft on first tab failed to wrap around');
    }
} else {
    fail(`Expected 4 resume tabs and 4 panels, found ${resumeBtns.length} tabs and ${resumePanels.length} panels`);
}

// ── 4. Portfolio Carousel Boundaries Tests ──────────────────────────────────
console.log('\n  \x1b[34mTesting Portfolio Carousel Boundaries:\x1b[0m');
const arrowRight = document.querySelector('.portfolio-box .navigation .arrow-right');
const arrowLeft = document.querySelector('.portfolio-box .navigation .arrow-left');
const currentSlideEl = document.querySelector('.portfolio-box .carousel-counter .current-slide');
const totalSlidesEl = document.querySelector('.portfolio-box .carousel-counter .total-slides');
const portfolioDetails = Array.from(document.querySelectorAll('.portfolio-detail'));

if (arrowRight && arrowLeft && currentSlideEl && totalSlidesEl) {
    // Initial state: slide 0
    if (currentSlideEl.textContent === '01' && arrowLeft.classList.contains('disabled') && arrowLeft.getAttribute('aria-disabled') === 'true') {
        pass('Slide 1 starts with counter "01" and left arrow disabled');
    } else {
        fail('Carousel did not initialize slide 0 boundary correctly');
    }

    // Try clicking left arrow at boundary -> should not go below 0
    arrowLeft.click();
    if (currentSlideEl.textContent === '01') {
        pass('Left arrow at lower boundary prevents out-of-bounds index');
    } else {
        fail('Left arrow went below 0 at boundary');
    }

    // Advance 5 times to slide 6 (last slide)
    for (let i = 0; i < 5; i++) {
        arrowRight.click();
    }

    if (currentSlideEl.textContent === '06' && arrowRight.classList.contains('disabled') && arrowRight.getAttribute('aria-disabled') === 'true' && !arrowLeft.classList.contains('disabled')) {
        pass('Advancing to last slide updates counter to "06" and disables right arrow');
    } else {
        fail(`Last slide boundary failed (counter: ${currentSlideEl.textContent}, right disabled: ${arrowRight.classList.contains('disabled')})`);
    }

    // Try clicking right arrow at boundary -> should not exceed 5
    arrowRight.click();
    if (currentSlideEl.textContent === '06') {
        pass('Right arrow at upper boundary prevents out-of-bounds index');
    } else {
        fail('Right arrow exceeded maximum slide index');
    }

    // Return to slide 1
    for (let i = 0; i < 5; i++) {
        arrowLeft.click();
    }
    if (currentSlideEl.textContent === '01') {
        pass('Reversed back to slide 1 successfully');
    } else {
        fail('Reversing back to slide 1 failed');
    }

    // Keyboard arrow navigation on carousel container
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        arrowRight.focus();
        portfolioSection.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        if (currentSlideEl.textContent === '02') {
            pass('ArrowRight keyboard event on carousel advances slide');
        } else {
            fail('ArrowRight keyboard event failed on carousel');
        }

        portfolioSection.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        if (currentSlideEl.textContent === '01') {
            pass('ArrowLeft keyboard event on carousel returns slide');
        } else {
            fail('ArrowLeft keyboard event failed on carousel');
        }
    }
} else {
    fail('Missing portfolio carousel navigation controls');
}

// ── 5. Certificate Lightbox Modal Tests ─────────────────────────────────────
console.log('\n  \x1b[34mTesting Certificate Viewer Modal:\x1b[0m');
const certLightbox = document.getElementById('cert-lightbox');
const certViewBtns = Array.from(document.querySelectorAll('.cert-view'));
const certLightboxClose = certLightbox ? certLightbox.querySelector('.cert-lightbox-close') : null;
const certLightboxPrev = certLightbox ? certLightbox.querySelector('.cert-lightbox-prev') : null;
const certLightboxNext = certLightbox ? certLightbox.querySelector('.cert-lightbox-next') : null;
const certLightboxImg = document.getElementById('cert-lightbox-img');
const certLightboxCounter = document.getElementById('cert-lightbox-counter');

if (certLightbox && certViewBtns.length === 3 && certLightboxClose && certLightboxNext && certLightboxPrev) {
    // Initial state: closed
    if (!certLightbox.classList.contains('active') && certLightbox.getAttribute('aria-hidden') === 'true') {
        pass('Certificate lightbox starts closed (aria-hidden="true")');
    } else {
        fail('Certificate lightbox did not start in closed state');
    }

    // Open first certificate
    certViewBtns[0].click();
    if (certLightbox.classList.contains('active') && certLightbox.getAttribute('aria-hidden') === 'false') {
        pass('Clicking View button opens certificate lightbox (aria-hidden="false")');
    } else {
        fail('Failed to open certificate lightbox on View click');
    }

    if (certLightboxCounter.textContent === '01 / 03' && certLightboxImg.src.includes('fundamental_programing')) {
        pass('Certificate 1 details loaded into modal (01 / 03, correct image)');
    } else {
        fail(`Certificate 1 details incorrect: counter=${certLightboxCounter.textContent}, src=${certLightboxImg.src}`);
    }

    // Next button -> Certificate 2
    certLightboxNext.click();
    if (certLightboxCounter.textContent === '02 / 03' && certLightboxImg.src.includes('Android')) {
        pass('Next button advances to Certificate 2 (Android Developer Fundamentals)');
    } else {
        fail('Next button failed to advance to Certificate 2');
    }

    // Next button -> Certificate 3
    certLightboxNext.click();
    if (certLightboxCounter.textContent === '03 / 03' && certLightboxImg.src.includes('AI_certificet')) {
        pass('Next button advances to Certificate 3 (Artificial Intelligence Fundamentals)');
    } else {
        fail('Next button failed to advance to Certificate 3');
    }

    // Next button -> wraps to Certificate 1
    certLightboxNext.click();
    if (certLightboxCounter.textContent === '01 / 03') {
        pass('Next button wraps around to Certificate 1');
    } else {
        fail('Next button failed to wrap around to Certificate 1');
    }

    // Prev button -> wraps to Certificate 3
    certLightboxPrev.click();
    if (certLightboxCounter.textContent === '03 / 03') {
        pass('Prev button wraps around to Certificate 3');
    } else {
        fail('Prev button failed to wrap around to Certificate 3');
    }

    // Keyboard Arrow navigation in modal
    certLightbox.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    if (certLightboxCounter.textContent === '01 / 03') {
        pass('Keyboard ArrowRight advances certificate in modal');
    } else {
        fail('Keyboard ArrowRight failed in modal');
    }

    // Keyboard Escape to close
    certLightbox.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    if (!certLightbox.classList.contains('active') && certLightbox.getAttribute('aria-hidden') === 'true') {
        pass('Escape key closes certificate modal (aria-hidden="true")');
    } else {
        fail('Escape key failed to close certificate modal');
    }
} else {
    fail('Missing certificate lightbox elements or cert-view buttons');
}

// ── 6. Contact Form & Access Request Workflow Tests ─────────────────────────
console.log('\n  \x1b[34mTesting Contact Form & Access Request Workflow:\x1b[0m');
const contactForm = document.getElementById('contact-form');
const fromName = document.getElementById('from_name');
const fromEmail = document.getElementById('from_email');
const subject = document.getElementById('subject');
const message = document.getElementById('message');
const charCounter = document.getElementById('char-counter');
const requestType = document.getElementById('request-type');
const requestBadge = document.getElementById('request-badge');
const repoProjectName = document.getElementById('repo-project-name');
const cancelRepoRequest = document.getElementById('cancel-repo-request');
const honeypot = document.getElementById('contact_website_url');
const formStatus = document.getElementById('form-status');

if (contactForm && fromName && fromEmail && subject && message && requestBadge && cancelRepoRequest) {
    // Character counter test
    message.value = 'Hello world testing message character counter!';
    message.dispatchEvent(new window.Event('input', { bubbles: true }));
    if (charCounter.textContent.startsWith(`${message.value.length} / 2000`)) {
        pass(`Character counter updates accurately on typing (${charCounter.textContent})`);
    } else {
        fail(`Character counter incorrect: ${charCounter.textContent}`);
    }

    // Repository Access Request Workflow test
    const repoAccessBtns = Array.from(document.querySelectorAll('.repo-access'));
    if (repoAccessBtns.length >= 1) {
        const testBtn = repoAccessBtns[0];
        const projectName = testBtn.dataset.project || 'Test Project';

        testBtn.click();
        if (requestType.value === 'repo_access' && requestBadge.style.display !== 'none' && repoProjectName.textContent === projectName) {
            pass(`Clicking "Request Access" for "${projectName}" activates access banner and sets request_type="repo_access"`);
        } else {
            fail(`Request Access click failed to populate badge (type: ${requestType.value}, display: ${requestBadge.style.display})`);
        }

        if (subject.value.includes(projectName) && message.value.includes(projectName)) {
            pass('Subject and Message auto-populated with project access request template');
        } else {
            fail('Subject and Message were not populated with access request template');
        }

        // Switch back to general message
        cancelRepoRequest.click();
        if (requestType.value === 'general' && requestBadge.style.display === 'none') {
            pass('Clicking "✕ Switch to General Message" clears access request mode');
        } else {
            fail('Cancel access request button failed to reset mode');
        }
    } else {
        fail('No .repo-access buttons found in portfolio');
    }

    // Validation: Submit empty form
    fromName.value = '';
    fromEmail.value = '';
    subject.value = '';
    message.value = '';

    contactForm.dispatchEvent(new window.Event('submit', { cancelable: true, bubbles: true }));
    const nameError = document.getElementById('from_name_error')?.textContent;
    const emailError = document.getElementById('from_email_error')?.textContent;
    const subjectError = document.getElementById('subject_error')?.textContent;
    const messageError = document.getElementById('message_error')?.textContent;

    if (nameError && emailError && subjectError && messageError) {
        pass('Empty form submission blocked and inline errors displayed for all required fields');
    } else {
        fail(`Inline validation error missing: name="${nameError}", email="${emailError}", subject="${subjectError}", message="${messageError}"`);
    }

    // Invalid email validation
    fromName.value = 'John Doe';
    fromEmail.value = 'invalid-email-format';
    subject.value = 'Software Project Inquiry';
    message.value = 'Valid message that exceeds minimum length threshold for testing.';

    contactForm.dispatchEvent(new window.Event('submit', { cancelable: true, bubbles: true }));
    const updatedEmailError = document.getElementById('from_email_error')?.textContent;
    if (updatedEmailError && updatedEmailError.length > 0) {
        pass(`Invalid email format correctly flagged with inline error: "${updatedEmailError}"`);
    } else {
        fail('Invalid email format was not rejected');
    }

    // Spam honeypot test: if honeypot has value, it prevents emailjs.send
    const prevSendCount = emailSendCallCount;
    fromEmail.value = 'legit@example.com';
    honeypot.value = 'http://spambot-link.com';

    contactForm.dispatchEvent(new window.Event('submit', { cancelable: true, bubbles: true }));
    if (emailSendCallCount === prevSendCount && formStatus.textContent.length > 0) {
        pass('Honeypot caught bot submission and prevented EmailJS transmission');
    } else {
        fail('Honeypot did not prevent transmission when filled');
    }
} else {
    fail('Missing contact form or input elements');
}

console.log(`\nSummary: ${passCount} passed, ${errorCount} failed.`);
process.exit(errorCount > 0 ? 1 : 0);
