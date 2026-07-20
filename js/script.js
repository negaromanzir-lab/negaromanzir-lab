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
