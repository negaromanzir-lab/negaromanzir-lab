const navLinks = document.querySelectorAll('header nav a');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('header nav');
const header = document.querySelector('header');
const sections = document.querySelectorAll('section[id]');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

const closeMobileMenu = () => {
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

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

const resumeBtn = document.querySelectorAll('.resume-btn');

resumeBtn.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        const resumeDetails = document.querySelectorAll('.resume-detail');

        resumeBtn.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        resumeDetails.forEach(detail => detail.classList.remove('active'));
        resumeDetails[idx].classList.add('active');
    });
});

const arrowRight = document.querySelector('.portfolio-box .navigation .arrow-right');
const arrowLeft = document.querySelector('.portfolio-box .navigation .arrow-left');

let index = 0;

const activePortfolio = () => {
    const imgSlide = document.querySelector('.portfolio-carousel .img-slide');
    const portfolioDetails = document.querySelectorAll('.portfolio-detail');

    imgSlide.style.transform = `translateX(calc(${index * -100}% - ${index * 2}rem))`;

    portfolioDetails.forEach(detail => detail.classList.remove('active'));
    portfolioDetails[index].classList.add('active');
};

arrowRight.addEventListener('click', () => {
    if (index < 4) {
        index++;
        arrowLeft.classList.remove('disabled');
    } else {
        index = 5;
        arrowRight.classList.add('disabled');
    }

    activePortfolio();
});

arrowLeft.addEventListener('click', () => {
    if (index > 1) {
        index--;
        arrowRight.classList.remove('disabled');
    } else {
        index = 0;
        arrowLeft.classList.add('disabled');
    }

    activePortfolio();
});


// ── Repository Access Requests ────────────────────────────────────────────────
// GitHub links are not public. A visitor asks for access by emailing you
// through the contact form, which EmailJS delivers to you with their
// name/email attached. Each button carries the project name it belongs to.
//
// Access requests are tagged three ways so you can always spot and filter them:
//   1. Subject is prefixed with "[ACCESS REQUEST]"  -> Gmail: subject:"[ACCESS REQUEST]"
//   2. Hidden field `request_type` = repo_access     -> renders in the email
//   3. Body opens with labelled "Request type / Project / Source" lines
// A normal contact form message carries request_type = general instead.
const REPO_ACCESS_TAG = '[ACCESS REQUEST]';

const repoAccessBtns = document.querySelectorAll('.repo-access');

const buildAccessRequest = (project) => {
    return `Hello Negaro,

I would like to request access to the GitHub repository for a project listed on your portfolio.

Request type: GitHub repository access
Project: ${project}
Source: Portfolio (negaromanzir portfolio)

A bit about me:
- Name:
- Purpose (learning / collaboration / freelance):
- Links to my own work:

Thank you.`;
};

repoAccessBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const project = btn.dataset.project || 'your project';
        const form = document.getElementById('contact-form');
        const nameField = form.querySelector('[name="from_name"]');
        const subjectField = form.querySelector('[name="subject"]');
        const messageField = form.querySelector('[name="message"]');
        const typeField = document.getElementById('request-type');
        const status = document.getElementById('form-status');

        subjectField.value = `${REPO_ACCESS_TAG} GitHub repository access — ${project}`;
        messageField.value = buildAccessRequest(project);
        typeField.value = 'repo_access';

        status.textContent = '✍️ Add your name, email and a short note, then hit send. I usually reply within 24 hours.';
        status.style.color = '#b0f484';

        form.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            nameField.focus({ preventScroll: true });
        }, 600);
    });
});


// ── Certificate Lightbox ─────────────────────────────────────────────────────
const certLightbox = document.getElementById('cert-lightbox');
const certLightboxImg = certLightbox.querySelector('img');
const certLightboxClose = certLightbox.querySelector('.cert-lightbox-close');

const openCertLightbox = (src) => {
    certLightboxImg.src = src;
    certLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeCertLightbox = () => {
    certLightbox.classList.remove('active');
    certLightboxImg.src = '';
    document.body.style.overflow = '';
};

document.querySelectorAll('.cert-view').forEach(btn => {
    btn.addEventListener('click', () => openCertLightbox(btn.dataset.cert));
});

certLightboxClose.addEventListener('click', closeCertLightbox);

certLightbox.addEventListener('click', (e) => {
    if (e.target === certLightbox) {
        closeCertLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certLightbox.classList.contains('active')) {
        closeCertLightbox();
    }
});


// ── EmailJS Contact Form ──────────────────────────────────────────────────────
// Replace the three placeholders below with your real EmailJS credentials.
// Sign up free at https://www.emailjs.com/ then:
//   1. Add an Email Service (Gmail) → copy the Service ID
//   2. Create an Email Template     → copy the Template ID
//   3. Go to Account → copy your Public Key
const EMAILJS_SERVICE_ID  = 'service_o23n4nq';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_zlatjm4';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'vuIpBr7Gx7oCqn4Zm';   // e.g. 'abcDEFghiJKL'

emailjs.init(EMAILJS_PUBLIC_KEY);

const contactForm = document.getElementById('contact-form');
const sendBtn     = document.getElementById('send-btn');
const formStatus  = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    sendBtn.disabled    = true;
    sendBtn.textContent = '⏳ Sending…';
    formStatus.textContent = '';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
        .then(() => {
            formStatus.textContent = '✅ Message sent! I\'ll get back to you within 24 hours.';
            formStatus.style.color = '#b0f484';
            contactForm.reset();
            // reset() also restores request_type to "general", so the next
            // message from the contact form is not tagged as an access request.
            document.getElementById('request-type').value = 'general';
        })
        .catch((err) => {
            console.error('EmailJS error:', err);
            formStatus.textContent = '❌ Something went wrong. Please try again or email me directly.';
            formStatus.style.color = '#ff6b6b';
        })
        .finally(() => {
            sendBtn.disabled    = false;
            sendBtn.textContent = '📨 Send Message';
        });
});
