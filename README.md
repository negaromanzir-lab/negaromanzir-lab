# 🌐 Negaro Manzir — Full-Stack Developer Portfolio

[![Portfolio Quality Checks & CI](https://github.com/negaromanzir-lab/negaromanzir-lab/actions/workflows/quality-checks.yml/badge.svg)](https://github.com/negaromanzir-lab/negaromanzir-lab/actions/workflows/quality-checks.yml)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat&logo=vercel)](https://negaromanzir-lab.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)

Production-grade personal portfolio and professional showcase for **Negaro Manzir**, Full-Stack Web Developer and Computer Science student at Arba Minch University. Engineered with modern vanilla web standards (HTML5, responsive CSS3 design system, and ES6+ JavaScript) for fast performance, accessibility, and zero runtime framework bloat.

🔗 **Live Production Site:** [https://negaromanzir-lab.vercel.app/](https://negaromanzir-lab.vercel.app/)  
📂 **GitHub Repository:** [https://github.com/negaromanzir-lab/negaromanzir-lab](https://github.com/negaromanzir-lab/negaromanzir-lab)

---

## 🚀 Key Highlights & Features

- **Professional Identity & Clean Hero:** Clear hierarchy positioning Full-Stack Web Development as primary, with Computer Science, Cybersecurity, and Technical Content Creation as supporting competencies.
- **Featured Projects Showcase:** 6 detailed projects with real technical stacks, problem/solution descriptions, live demo links, verified GitHub repositories, and controlled access-request workflows.
- **Dedicated Case Study:** In-depth technical breakdown for the [DxValley Incubation Center Management System (ICMS)](https://negaromanzir-lab.vercel.app/dxvalley-case-study.html).
- **Interactive Résumé & Verified Nanodegrees:** Tab-partitioned Experience, Education, Skills, and About sections with keyboard arrow navigation (ARIA 1.2), alongside verified Udacity Nanodegree credentials with direct verification URLs.
- **Accessible Lightbox Modal:** Accessible certificate modal with focus-trapping, keyboard navigation (ArrowLeft/ArrowRight/Escape), and backdrop dismiss.
- **Contact Form & Access Workflow:** EmailJS integration with client-side validation, length limits, live character counter, honeypot anti-spam defense, and repository-access pre-fill flow.
- **Single-Page PDF Résumé:** Automated PDF compilation pipeline via `generate_resume.js` and `pdfkit`, linked directly to the primary hero download CTA.
- **Web Performance & Asset Optimization:** Modern WebP images with fallbacks, explicit aspect-ratio reservations (0 CLS), render-blocking `@import` elimination, and Vercel immutable asset caching.
- **Strict Accessibility (WCAG 2.1 AA):** Skip navigation link, high-contrast focus rings, semantic button elements, sequential heading hierarchy (`h1` -> `h2` -> `h3` -> `h4`), and prefers-reduced-motion compliance.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | HTML5 Semantic Markup, CSS3 Custom Properties (Design System), Vanilla JavaScript (ES6+) |
| **Styling & System** | Mobile-First Responsive Grid/Flexbox, Dark Theme (`#0b0f17`), Emerald Accent (`#10b981`), Accessible Focus Rings |
| **Icons & Typography** | Boxicons 2.1.4, Google Fonts (Poppins with `font-display: swap` and preconnects) |
| **Form Service** | EmailJS Browser SDK v4 (with honeypot spam protection & rate-limiting cooldown) |
| **Build & Tooling** | Node.js (v20+), PDFKit (automated CV compilation), JSDOM (headless runtime testing) |
| **Hosting & CDN** | Vercel (Edge Network, clean URLs, security headers, immutable static caching) |
| **CI / CD** | GitHub Actions (`quality-checks.yml` automated workflow on push/PR) |

---

## 📂 Repository Structure

```text
complite portifolio/
├── .github/
│   └── workflows/
│       └── quality-checks.yml       # Automated GitHub Actions CI workflow
├── assets/
│   └── docs/
│       └── Negaro_Manzir_Resume.pdf # Compiled, single-page professional resume
├── css/
│   └── style.css                    # Unified design system and component styles
├── images/
│   ├── certificate/                 # Certificate preview assets (WebP & PNG)
│   ├── portfolio*.webp / *.jpg      # Optimized project showcase screenshots
│   └── user-2.webp / user-2.png     # Optimized hero profile images
├── js/
│   └── script.js                    # Navigation, tabs, carousel, modal & form logic
├── tests/
│   ├── check-case-sensitivity.js    # Case-sensitivity check for Linux/Vercel
│   ├── lint-syntax.js               # JavaScript syntax and JSON formatting validation
│   ├── run-all.js                   # Master test runner orchestrating all suites
│   ├── test-behavior.js             # Interactive DOM & runtime testing via JSDOM
│   ├── validate-html.js             # Semantic HTML, accessibility, heading order checks
│   └── verify-links-assets.js       # Asset paths, anchor targets, and placeholder scan
├── dxvalley-case-study.html         # Dedicated technical case study page
├── generate_resume.js               # Programmatic PDF résumé builder (PDFKit)
├── index.html                       # Primary portfolio landing page
├── package.json                     # Scripts, metadata, and lightweight devDependencies
├── robots.txt                       # Search engine crawling rules & sitemap pointer
├── sitemap.xml                      # XML sitemap for SEO discovery
└── vercel.json                      # Vercel deployment headers, clean URLs & cache rules
```

---

## 🧪 Quality Assurance & Test Suite

The repository includes a zero-bloat automated testing suite executing 5 validation layers:

```bash
# Run the complete test suite
npm test
```

### Individual Test Commands:
- `npm run test:syntax`: Checks JavaScript syntax (`node:vm`) and JSON formatting (`package.json`, `vercel.json`, `sitemap.xml`, `robots.txt`).
- `npm run test:html`: Validates DOCTYPE, language tags, unique element IDs, sequential heading levels (`h1`..`h4`), image `alt` texts, and form labels.
- `npm run test:links`: Confirms every local image, stylesheet, script, and PDF path exists on disk, verifies anchor links, scans for Lorem Ipsum, and checks project card completeness.
- `npm run test:behavior`: Evaluates interactive DOM behavior in JSDOM (mobile navigation, tab switching, carousel boundaries, certificate modal focus trap, and form validation).

---

## ⚙️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/negaromanzir-lab/negaromanzir-lab.git
   cd negaromanzir-lab
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run local quality checks:**
   ```bash
   npm test
   ```

4. **Serve locally:**
   You can serve the static files with any local HTTP server:
   ```bash
   npx serve .
   # or with Python
   python -m http.server 8080
   ```
   Open `http://localhost:8080` in your web browser.

5. **Regenerate the PDF Résumé (optional):**
   ```bash
   npm run generate-resume
   ```

---

## 🌐 Production Deployment on Vercel

The website is configured for zero-configuration static deployment on Vercel:

1. **Root Directory:** Project root (`/`)
2. **Build Command:** None required (static HTML/CSS/JS)
3. **Output Directory:** Project root (`/`)
4. **Configuration (`vercel.json`):**
   - Clean URLs enabled (`cleanUrls: true`)
   - 1-year immutable caching on static assets (`/(images|css|js|assets)/(.*)`)
   - Instant revalidation on HTML files (`max-age=0, must-revalidate`)
   - Strict security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`)

---

## 📬 EmailJS Configuration Guide

The contact form uses the official EmailJS Browser SDK. To ensure messages reach your inbox:

1. **Create an EmailJS Account** at [https://www.emailjs.com/](https://www.emailjs.com/).
2. **Create an Email Service** (e.g. Gmail) and obtain your `Service ID` (configured as `service_o23n4nq`).
3. **Create an Email Template** and obtain your `Template ID` (configured as `template_zlatjm4`).
4. **Template Parameter Mapping:** Ensure your EmailJS template references these exact parameter names:
   - `{{from_name}}` — Sender's full name
   - `{{from_email}}` — Sender's email address
   - `{{phone}}` — Sender's contact number (or "Not provided")
   - `{{subject}}` — Message subject
   - `{{message}}` — Message body
   - `{{request_type}}` — Either `general` or `repo_access`
   - `{{timestamp}}` — Submission time (ISO string)
5. **Dashboard Security Settings:**
   - In EmailJS Dashboard under **Account** -> **Security**, enable **Allowed Domains** and whitelist:
     - `https://negaromanzir-lab.vercel.app`
     - `http://localhost:8080` (for local development testing)
   - Ensure the Public Key in `js/script.js` matches your dashboard public key.

---

## 🛡️ Rollback & Maintenance Plan

- **Instant Vercel Rollback:** If an unexpected regression occurs in production, navigate to **Vercel Dashboard -> Deployments**, locate the last known good deployment, and click **Promote to Production** (instant zero-downtime rollback).
- **Git Revert:**
  ```bash
  git log -n 5 --oneline
  git revert HEAD
  git push origin main
  ```
- **Pre-Deployment Checklist:**
  1. Run `npm test` locally (ensures 5/5 test suites pass).
  2. If résumé copy changed, run `npm run generate-resume` to sync the downloadable PDF.
  3. Ensure no unstaged or untracked asset files are missing before pushing.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
