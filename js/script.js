const navLinks = document.querySelectorAll('header nav a');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('header nav');
const header = document.querySelector('header');
const sections = document.querySelectorAll('section[id]');

const toggleMobileMenu = () => {
    if (!menuIcon || !navbar) return;
    const isExpanded = menuIcon.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;
    menuIcon.setAttribute('aria-expanded', String(nextState));
    menuIcon.classList.toggle('bx-x', nextState);
    navbar.classList.toggle('active', nextState);
};

const closeMobileMenu = () => {
    if (!menuIcon || !navbar) return;
    menuIcon.setAttribute('aria-expanded', 'false');
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

if (menuIcon) {
    menuIcon.addEventListener('click', toggleMobileMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar && navbar.classList.contains('active')) {
            closeMobileMenu();
            menuIcon.focus();
        }
    });
}

const setActiveLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const link = document.querySelector(`header nav a[href="#${sectionId}"]`);

        if (!link) return;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
        setTimeout(setActiveLink, 100);
    });
});

window.addEventListener('scroll', () => {
    setActiveLink();

    if (window.scrollY > 30) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

setActiveLink();

const resumeBtns = document.querySelectorAll('.resume-btn');
const resumeDetails = document.querySelectorAll('.resume-detail');

const switchResumeTab = (idx) => {
    if (idx < 0 || idx >= resumeBtns.length) return;

    resumeBtns.forEach((btn, i) => {
        const isActive = (i === idx);
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    resumeDetails.forEach((detail, i) => {
        detail.classList.toggle('active', i === idx);
    });

    resumeBtns[idx].focus();
};

resumeBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => switchResumeTab(idx));

    // Keyboard support for ARIA tabs: ArrowLeft / ArrowUp / ArrowRight / ArrowDown / Home / End
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIdx = (idx + 1) % resumeBtns.length;
            switchResumeTab(nextIdx);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIdx = (idx - 1 + resumeBtns.length) % resumeBtns.length;
            switchResumeTab(prevIdx);
        } else if (e.key === 'Home') {
            e.preventDefault();
            switchResumeTab(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            switchResumeTab(resumeBtns.length - 1);
        }
    });
});

const arrowRight = document.querySelector('.portfolio-box .navigation .arrow-right');
const arrowLeft = document.querySelector('.portfolio-box .navigation .arrow-left');
const currentSlideEl = document.querySelector('.portfolio-box .carousel-counter .current-slide');
const totalSlidesEl = document.querySelector('.portfolio-box .carousel-counter .total-slides');

let index = 0;

const updateCarouselState = () => {
    const imgSlide = document.querySelector('.portfolio-carousel .img-slide');
    const portfolioDetails = document.querySelectorAll('.portfolio-detail');
    const total = portfolioDetails.length;

    if (total === 0) return;

    if (index >= total) index = total - 1;
    if (index < 0) index = 0;

    imgSlide.style.transform = `translateX(calc(${index * -100}% - ${index * 2}rem))`;

    portfolioDetails.forEach((detail, i) => {
        if (i === index) {
            detail.classList.add('active');
        } else {
            detail.classList.remove('active');
        }
    });

    if (currentSlideEl) {
        currentSlideEl.textContent = String(index + 1).padStart(2, '0');
    }
    if (totalSlidesEl) {
        totalSlidesEl.textContent = String(total).padStart(2, '0');
    }

    if (index === 0) {
        arrowLeft.classList.add('disabled');
        arrowLeft.setAttribute('aria-disabled', 'true');
    } else {
        arrowLeft.classList.remove('disabled');
        arrowLeft.removeAttribute('aria-disabled');
    }

    if (index === total - 1) {
        arrowRight.classList.add('disabled');
        arrowRight.setAttribute('aria-disabled', 'true');
    } else {
        arrowRight.classList.remove('disabled');
        arrowRight.removeAttribute('aria-disabled');
    }
};

if (arrowRight) {
    arrowRight.addEventListener('click', () => {
        const total = document.querySelectorAll('.portfolio-detail').length;
        if (index < total - 1) {
            index++;
            updateCarouselState();
        }
    });
}

if (arrowLeft) {
    arrowLeft.addEventListener('click', () => {
        if (index > 0) {
            index--;
            updateCarouselState();
        }
    });
}

// Initial carousel state sync
updateCarouselState();

// Keyboard navigation support for portfolio carousel
const portfolioSection = document.getElementById('portfolio');
if (portfolioSection) {
    portfolioSection.addEventListener('keydown', (e) => {
        if (e.target.closest('#portfolio')) {
            const total = document.querySelectorAll('.portfolio-detail').length;
            if (e.key === 'ArrowRight' && index < total - 1) {
                e.preventDefault();
                index++;
                updateCarouselState();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                index--;
                updateCarouselState();
            }
        }
    });
}


// ── Certificate Lightbox ─────────────────────────────────────────────────────
const certLightbox = document.getElementById('cert-lightbox');
const certLightboxImg = document.getElementById('cert-lightbox-img');
const certLightboxTitle = document.getElementById('cert-lightbox-title');
const certLightboxCounter = document.getElementById('cert-lightbox-counter');
const certLightboxVerify = document.getElementById('cert-lightbox-verify');
const certLightboxClose = certLightbox ? certLightbox.querySelector('.cert-lightbox-close') : null;
const certLightboxPrev = certLightbox ? certLightbox.querySelector('.cert-lightbox-prev') : null;
const certLightboxNext = certLightbox ? certLightbox.querySelector('.cert-lightbox-next') : null;
const certViewBtns = Array.from(document.querySelectorAll('.cert-view'));

let currentCertIndex = 0;
let lastFocusedElement = null;

const updateLightboxContent = () => {
    if (currentCertIndex < 0) currentCertIndex = 0;
    if (currentCertIndex >= certViewBtns.length) currentCertIndex = certViewBtns.length - 1;

    const btn = certViewBtns[currentCertIndex];
    if (!btn) return;

    const src = btn.dataset.cert || '';
    const title = btn.dataset.title || 'Certificate';
    const verifyUrl = btn.dataset.verify || '#';

    if (certLightboxImg) {
        certLightboxImg.src = src;
        certLightboxImg.alt = title;
    }
    if (certLightboxTitle) certLightboxTitle.textContent = title;
    if (certLightboxCounter) certLightboxCounter.textContent = `${String(currentCertIndex + 1).padStart(2, '0')} / ${String(certViewBtns.length).padStart(2, '0')}`;
    if (certLightboxVerify) {
        certLightboxVerify.href = verifyUrl;
        certLightboxVerify.style.display = (verifyUrl && verifyUrl !== '#') ? 'inline-flex' : 'none';
    }
};

const openCertLightbox = (index) => {
    lastFocusedElement = document.activeElement;
    currentCertIndex = index;
    updateLightboxContent();
    certLightbox.classList.add('active');
    certLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        if (certLightboxClose) certLightboxClose.focus();
    }, 50);
};

const closeCertLightbox = () => {
    certLightbox.classList.remove('active');
    certLightbox.setAttribute('aria-hidden', 'true');
    if (certLightboxImg) certLightboxImg.src = 'images/certificate/fundamental_programing.webp';
    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
};

certViewBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => openCertLightbox(idx));
});

if (certLightboxClose) certLightboxClose.addEventListener('click', closeCertLightbox);

if (certLightboxPrev) {
    certLightboxPrev.addEventListener('click', () => {
        currentCertIndex = (currentCertIndex - 1 + certViewBtns.length) % certViewBtns.length;
        updateLightboxContent();
    });
}

if (certLightboxNext) {
    certLightboxNext.addEventListener('click', () => {
        currentCertIndex = (currentCertIndex + 1) % certViewBtns.length;
        updateLightboxContent();
    });
}

if (certLightbox) {
    certLightbox.addEventListener('click', (e) => {
        if (e.target === certLightbox) {
            closeCertLightbox();
        }
    });

    // Modal accessibility: Focus trap inside dialog while open
    certLightbox.addEventListener('keydown', (e) => {
        if (!certLightbox.classList.contains('active')) return;

        if (e.key === 'Tab') {
            const focusable = Array.from(certLightbox.querySelectorAll(
                'button:not([disabled]), [href]:not([disabled]), [tabindex="0"]'
            )).filter(el => el.offsetParent !== null);

            if (focusable.length === 0) return;

            const firstEl = focusable[0];
            const lastEl = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeCertLightbox();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            currentCertIndex = (currentCertIndex - 1 + certViewBtns.length) % certViewBtns.length;
            updateLightboxContent();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentCertIndex = (currentCertIndex + 1) % certViewBtns.length;
            updateLightboxContent();
        }
    });
}


// ── CONTACT FORM & REPOSITORY ACCESS WORKFLOW ─────────────────────────────────
// Configuration for EmailJS and form validation.
// Public tokens are designed for client-side use; private API keys or passwords must never be stored here.
const EMAILJS_CONFIG = {
    serviceId: 'service_o23n4nq',
    templateId: 'template_zlatjm4',
    publicKey: 'vuIpBr7Gx7oCqn4Zm',
    recipientEmail: 'negaromanzir@gmail.com',
    rateLimitMs: 30000,           // 30-second cooldown between real submissions
    minInteractionTimeMs: 2000,   // Minimum 2s interaction time to deflect automated bots
    limits: {
        nameMin: 2,
        nameMax: 80,
        emailMax: 100,
        phoneMax: 25,
        subjectMin: 3,
        subjectMax: 120,
        messageMin: 10,
        messageMax: 2000
    }
};

// Initialize EmailJS client
if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey) {
    try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    } catch (initErr) {
        console.error('EmailJS initialization warning:', initErr);
    }
}

// DOM Elements
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('from_name');
const emailInput = document.getElementById('from_email');
const phoneInput = document.getElementById('phone');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');
const requestTypeInput = document.getElementById('request-type');
const honeypotInput = contactForm ? contactForm.querySelector('input[name="_gotcha"]') : null;
const sendBtn = document.getElementById('send-btn');
const sendBtnText = document.getElementById('send-btn-text');
const sendBtnIcon = document.getElementById('send-btn-icon');
const formStatus = document.getElementById('form-status');
const charCounter = document.getElementById('char-counter');
const requestBadge = document.getElementById('request-badge');
const repoProjectNameEl = document.getElementById('repo-project-name');
const cancelRepoRequestBtn = document.getElementById('cancel-repo-request');
const repoAccessBtns = document.querySelectorAll('.repo-access');

// State Tracking
let lastSubmitTime = 0;
let isSubmitting = false;
const pageLoadTimestamp = Date.now();
const REPO_ACCESS_TAG = '[ACCESS REQUEST]';

// ── Status & Inline Error Utilities ──────────────────────────────────────────
const showStatus = (type, message, isHtml = false) => {
    if (!formStatus) return;
    formStatus.className = `form-status active status-${type}`;
    if (isHtml) {
        formStatus.innerHTML = message;
    } else {
        formStatus.textContent = message;
    }
};

const hideStatus = () => {
    if (!formStatus) return;
    formStatus.className = 'form-status';
    formStatus.textContent = '';
    formStatus.innerHTML = '';
};

const setFieldError = (input, errorId, message) => {
    if (!input) return;
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    const errEl = document.getElementById(errorId);
    if (errEl) {
        errEl.textContent = message;
        errEl.classList.add('active');
    }
};

const clearFieldError = (input, errorId) => {
    if (!input) return;
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    const errEl = document.getElementById(errorId);
    if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('active');
    }
};

const clearAllErrors = () => {
    clearFieldError(nameInput, 'from_name_error');
    clearFieldError(emailInput, 'from_email_error');
    clearFieldError(phoneInput, 'phone_error');
    clearFieldError(subjectInput, 'subject_error');
    clearFieldError(messageInput, 'message_error');
};

const updateCharCounter = () => {
    if (!messageInput || !charCounter) return;
    const count = messageInput.value.length;
    const max = EMAILJS_CONFIG.limits.messageMax;
    charCounter.textContent = `${count} / ${max}`;
    
    charCounter.classList.toggle('near-limit', count >= max * 0.9 && count < max);
    charCounter.classList.toggle('at-limit', count >= max);
};

// ── Repository Access Mode Management ────────────────────────────────────────
const buildAccessRequestMessage = (project) => {
    return `Hello Negaro,

I would like to request access to the GitHub repository for: ${project}.

Request details:
- Project: ${project}
- Purpose (code review / collaboration / learning): 
- GitHub Username: 

Thank you!`;
};

const setRepoAccessMode = (project) => {
    if (!contactForm) return;
    clearAllErrors();
    hideStatus();

    if (requestTypeInput) requestTypeInput.value = 'repo_access';
    if (subjectInput) subjectInput.value = `${REPO_ACCESS_TAG} GitHub repository access — ${project}`;
    if (messageInput) {
        messageInput.value = buildAccessRequestMessage(project);
        updateCharCounter();
    }
    if (repoProjectNameEl) repoProjectNameEl.textContent = project;
    if (requestBadge) requestBadge.style.display = 'flex';

    if (contactForm && typeof contactForm.scrollIntoView === 'function') {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
        if (nameInput) nameInput.focus({ preventScroll: true });
    }, 450);
};

const clearRepoAccessMode = (resetStatus = false) => {
    if (requestTypeInput) requestTypeInput.value = 'general';
    if (requestBadge) requestBadge.style.display = 'none';
    if (repoProjectNameEl) repoProjectNameEl.textContent = '';
    
    if (subjectInput && subjectInput.value.startsWith(REPO_ACCESS_TAG)) {
        subjectInput.value = '';
    }
    if (messageInput && (messageInput.value.includes(REPO_ACCESS_TAG) || messageInput.value.includes('GitHub repository'))) {
        messageInput.value = '';
        updateCharCounter();
    }
    clearAllErrors();
    if (resetStatus) {
        hideStatus();
    }
};

if (cancelRepoRequestBtn) {
    cancelRepoRequestBtn.addEventListener('click', () => {
        clearRepoAccessMode(true);
        showStatus('loading', 'Switched back to general contact message.');
        setTimeout(hideStatus, 2000);
    });
}

repoAccessBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const project = btn.dataset.project || 'Project';
        setRepoAccessMode(project);
    });
});

// ── Field Validation ─────────────────────────────────────────────────────────
const validateForm = () => {
    let isValid = true;
    let firstInvalid = null;

    // 1. Full Name
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
        setFieldError(nameInput, 'from_name_error', 'Please enter your name.');
        isValid = false;
        if (!firstInvalid) firstInvalid = nameInput;
    } else if (nameVal.length < EMAILJS_CONFIG.limits.nameMin) {
        setFieldError(nameInput, 'from_name_error', `Name must be at least ${EMAILJS_CONFIG.limits.nameMin} characters.`);
        isValid = false;
        if (!firstInvalid) firstInvalid = nameInput;
    } else if (nameVal.length > EMAILJS_CONFIG.limits.nameMax) {
        setFieldError(nameInput, 'from_name_error', `Name must not exceed ${EMAILJS_CONFIG.limits.nameMax} characters.`);
        isValid = false;
        if (!firstInvalid) firstInvalid = nameInput;
    } else {
        clearFieldError(nameInput, 'from_name_error');
    }

    // 2. Email Address
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailVal) {
        setFieldError(emailInput, 'from_email_error', 'Please enter your email address.');
        isValid = false;
        if (!firstInvalid) firstInvalid = emailInput;
    } else if (!emailRegex.test(emailVal) || !emailVal.includes('.') || emailVal.split('.').pop().length < 2) {
        setFieldError(emailInput, 'from_email_error', 'Please enter a valid email address (e.g. name@example.com).');
        isValid = false;
        if (!firstInvalid) firstInvalid = emailInput;
    } else if (emailVal.length > EMAILJS_CONFIG.limits.emailMax) {
        setFieldError(emailInput, 'from_email_error', `Email must not exceed ${EMAILJS_CONFIG.limits.emailMax} characters.`);
        isValid = false;
        if (!firstInvalid) firstInvalid = emailInput;
    } else {
        clearFieldError(emailInput, 'from_email_error');
    }

    // 3. Phone Number (Optional)
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (phoneVal) {
        const phoneRegex = /^[+]?[\d\s().-]{7,25}$/;
        if (!phoneRegex.test(phoneVal) || phoneVal.length > EMAILJS_CONFIG.limits.phoneMax) {
            setFieldError(phoneInput, 'phone_error', 'Please enter a valid phone number or leave blank.');
            isValid = false;
            if (!firstInvalid) firstInvalid = phoneInput;
        } else {
            clearFieldError(phoneInput, 'phone_error');
        }
    } else {
        clearFieldError(phoneInput, 'phone_error');
    }

    // 4. Subject
    const subjectVal = subjectInput ? subjectInput.value.trim() : '';
    if (!subjectVal) {
        setFieldError(subjectInput, 'subject_error', 'Please enter a subject.');
        isValid = false;
        if (!firstInvalid) firstInvalid = subjectInput;
    } else if (subjectVal.length < EMAILJS_CONFIG.limits.subjectMin) {
        setFieldError(subjectInput, 'subject_error', `Subject must be at least ${EMAILJS_CONFIG.limits.subjectMin} characters.`);
        isValid = false;
        if (!firstInvalid) firstInvalid = subjectInput;
    } else if (subjectVal.length > EMAILJS_CONFIG.limits.subjectMax) {
        setFieldError(subjectInput, 'subject_error', `Subject must not exceed ${EMAILJS_CONFIG.limits.subjectMax} characters.`);
        isValid = false;
        if (!firstInvalid) firstInvalid = subjectInput;
    } else {
        clearFieldError(subjectInput, 'subject_error');
    }

    // 5. Message
    const messageVal = messageInput ? messageInput.value.trim() : '';
    if (!messageVal) {
        setFieldError(messageInput, 'message_error', 'Please write your message.');
        isValid = false;
        if (!firstInvalid) firstInvalid = messageInput;
    } else if (messageVal.length < EMAILJS_CONFIG.limits.messageMin) {
        setFieldError(messageInput, 'message_error', `Message must be at least ${EMAILJS_CONFIG.limits.messageMin} characters.`);
        isValid = false;
        if (!firstInvalid) firstInvalid = messageInput;
    } else if (messageVal.length > EMAILJS_CONFIG.limits.messageMax) {
        setFieldError(messageInput, 'message_error', `Message must not exceed ${EMAILJS_CONFIG.limits.messageMax} characters.`);
        isValid = false;
        if (!firstInvalid) firstInvalid = messageInput;
    } else {
        clearFieldError(messageInput, 'message_error');
    }

    return { isValid, firstInvalid };
};

// Real-time cleanup listeners
if (messageInput) {
    messageInput.addEventListener('input', () => {
        updateCharCounter();
        if (messageInput.classList.contains('is-invalid') && messageInput.value.trim().length >= EMAILJS_CONFIG.limits.messageMin) {
            clearFieldError(messageInput, 'message_error');
        }
    });
}

[nameInput, emailInput, phoneInput, subjectInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
            validateForm();
        }
    });
});

// ── Contact Form Submission Handler ──────────────────────────────────────────
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) return;

        // 1. Anti-spam honeypot verification
        if (honeypotInput && honeypotInput.value.trim() !== '') {
            showStatus('success', '✅ Message sent! I\'ll get back to you within 24 hours.');
            contactForm.reset();
            clearRepoAccessMode();
            return;
        }

        // 2. Client-side field validation
        const { isValid, firstInvalid } = validateForm();
        if (!isValid) {
            showStatus('error', 'Please correct the highlighted fields above before submitting.');
            if (firstInvalid && typeof firstInvalid.focus === 'function') {
                firstInvalid.focus();
            }
            return;
        }

        // 3. Anti-spam interaction time verification (bypassed in test simulation mode)
        const isSimulated = (typeof window !== 'undefined' && (window.__SIMULATE_EMAIL_SUCCESS || window.__SIMULATE_EMAIL_FAILURE));
        if (!isSimulated && (Date.now() - pageLoadTimestamp < EMAILJS_CONFIG.minInteractionTimeMs)) {
            showStatus('error', 'Submission was too fast. Please take a moment to review your message before submitting.');
            return;
        }

        // 4. Rate-limiting cooldown verification
        const now = Date.now();
        if (!isSimulated && (now - lastSubmitTime < EMAILJS_CONFIG.rateLimitMs)) {
            const remaining = Math.ceil((EMAILJS_CONFIG.rateLimitMs - (now - lastSubmitTime)) / 1000);
            showStatus('error', `⏳ Please wait ${remaining}s before sending another message.`);
            return;
        }

        // Engage Sending State
        isSubmitting = true;
        contactForm.setAttribute('aria-busy', 'true');
        sendBtn.disabled = true;
        if (sendBtnIcon) sendBtnIcon.className = 'bx bx-loader-alt bx-spin';
        if (sendBtnText) sendBtnText.textContent = 'Sending...';
        showStatus('loading', 'Sending your message, please wait...');

        try {
            // Testing / Simulation Hooks (allows thorough tests without sending live emails)
            if (window.__SIMULATE_EMAIL_FAILURE) {
                await new Promise((_, reject) => setTimeout(() => reject(new Error('Simulated network delivery failure')), 100));
            } else if (window.__SIMULATE_EMAIL_SUCCESS) {
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                if (typeof emailjs === 'undefined') {
                    throw new Error('EmailJS SDK failed to load');
                }
                await emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, contactForm);
            }

            // Success handling
            lastSubmitTime = Date.now();
            showStatus('success', '✅ Thank you! Your message has been sent successfully. I will get back to you within 24 hours.');
            contactForm.reset();
            clearRepoAccessMode();
            updateCharCounter();
            clearAllErrors();
        } catch (err) {
            console.error('Email submission error:', err);
            // Failure handling: preserve inputs and surface direct mailto fallback
            const fallbackSubject = encodeURIComponent(subjectInput ? subjectInput.value : 'Portfolio Contact');
            const fallbackBody = encodeURIComponent(messageInput ? messageInput.value : '');
            const mailtoUrl = `mailto:${EMAILJS_CONFIG.recipientEmail}?subject=${fallbackSubject}&body=${fallbackBody}`;

            showStatus(
                'error',
                `❌ Unable to send message automatically. Please try again or email me directly at <a href="${mailtoUrl}">${EMAILJS_CONFIG.recipientEmail}</a>.`,
                true
            );
        } finally {
            // Restore interactive submission controls
            isSubmitting = false;
            contactForm.removeAttribute('aria-busy');
            sendBtn.disabled = false;
            if (sendBtnIcon) sendBtnIcon.className = 'bx bx-send';
            if (sendBtnText) sendBtnText.textContent = 'Send Message';
        }
    });
}

// Initial character counter sync
updateCharCounter();
