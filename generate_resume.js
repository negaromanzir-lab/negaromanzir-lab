const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const docsDir = path.join(assetsDir, 'docs');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

const outputPath = path.join(docsDir, 'Negaro_Manzir_Resume.pdf');
const doc = new PDFDocument({
    margin: 36,
    size: 'LETTER',
    info: {
        Title: 'Negaro Manzir — Full-Stack Web Developer Résumé',
        Author: 'Negaro Manzir',
        Subject: 'Full-Stack Web Development & Computer Science Résumé',
        Keywords: 'Full-Stack Developer, React, Node.js, Express, PostgreSQL, MongoDB, Negaro Manzir, Computer Science'
    }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Professional palette
const primaryColor = '#0f8a0f'; // Dark green
const darkColor = '#111827';
const grayColor = '#4b5563';
const lineColor = '#e5e7eb';

// ── Header ──
doc.font('Helvetica-Bold').fontSize(20).fillColor(darkColor).text('NEGARO MANZIR', { characterSpacing: 0.5 });
doc.font('Helvetica-Bold').fontSize(10.5).fillColor(primaryColor).text('Full-Stack Web Developer · Computer Science Student', { characterSpacing: 0.2 });

doc.moveDown(0.2);
doc.font('Helvetica').fontSize(8.8).fillColor(grayColor);
doc.text('Ambo / Arba Minch, Ethiopia  |  negaromanzir@gmail.com  |  (+251) 931 457 595');
doc.text('Portfolio: negaromanzir-lab.vercel.app  |  GitHub: github.com/negaromanzir-lab  |  Telegram: @negoman');

doc.moveDown(0.3);
doc.strokeColor(lineColor).lineWidth(1).moveTo(36, doc.y).lineTo(576, doc.y).stroke();
doc.moveDown(0.4);

// Helper for section headings
function sectionHeading(title) {
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text(title.toUpperCase(), { characterSpacing: 0.5 });
    doc.strokeColor(primaryColor).lineWidth(0.8).moveTo(36, doc.y + 1.5).lineTo(576, doc.y + 1.5).stroke();
    doc.moveDown(0.35);
}

// ── Summary ──
sectionHeading('Professional Summary');
doc.font('Helvetica').fontSize(8.7).fillColor(darkColor).lineGap(1.2);
doc.text(
    'Computer Science student at Arba Minch University and proactive Full-Stack Web Developer with practical expertise building responsive frontend interfaces, RESTful web services, and relational/document database architectures. Demonstrated experience implementing role-based access control, stateful APIs, vector retrieval systems (RAG), and dual web/desktop platforms using React, Node.js, Express, PostgreSQL, and MongoDB. Committed to clean code, robust system design, and continuous engineering growth.'
);

// ── Skills ──
sectionHeading('Technical Skills');
doc.font('Helvetica-Bold').fontSize(8.7).fillColor(darkColor);
doc.text('Languages: ', { continued: true }).font('Helvetica').fillColor(grayColor).text('JavaScript (ES6+), TypeScript, Python, C++, Java, PHP, HTML5, CSS3, SQL');
doc.font('Helvetica-Bold').fillColor(darkColor).text('Frontend: ', { continued: true }).font('Helvetica').fillColor(grayColor).text('React.js, React Router, Vite, Tailwind CSS, Responsive Design, Component Architecture');
doc.font('Helvetica-Bold').fillColor(darkColor).text('Backend & APIs: ', { continued: true }).font('Helvetica').fillColor(grayColor).text('Node.js, Express.js, RESTful API Design, Server-Sent Events (SSE), JWT & Session Authentication');
doc.font('Helvetica-Bold').fillColor(darkColor).text('Databases & Tools: ', { continued: true }).font('Helvetica').fillColor(grayColor).text('PostgreSQL, pgvector, MongoDB (Mongoose), MySQL, Git, GitHub, Bun, Electron, Linux/Bash');
doc.font('Helvetica-Bold').fillColor(darkColor).text('Security & Architecture: ', { continued: true }).font('Helvetica').fillColor(grayColor).text('OWASP Top 10 Awareness, Input Validation, Role-Based Access Control (RBAC), Practical Auditing');

// ── Featured Projects ──
sectionHeading('Key Engineering Projects');

// Project 1
doc.font('Helvetica-Bold').fontSize(9).fillColor(darkColor).text('DxValley Incubation Center Management System (ICMS) ', { continued: true });
doc.font('Helvetica-Bold').fontSize(8).fillColor(primaryColor).text('[Node.js, Express, PostgreSQL, EJS, Electron, Tailwind]');
doc.font('Helvetica').fontSize(8).fillColor(grayColor).text('Live: dxvalley-icms.onrender.com  |  Repo: github.com/negaromanzir-lab/Business-Incubator-Platform-DBMS');
doc.font('Helvetica').fontSize(8.4).fillColor(darkColor).lineGap(1);
doc.text('• Architected an operations platform connecting founder web applications with an Electron desktop manager interface over a shared PostgreSQL database.');
doc.text('• Implemented a 3-stage venture state machine (Idea -> MVP -> Scale-Up) with automated notification triggers for team members upon stage review.');
doc.text('• Designed normalized relational schemas with foreign key integrity governing entrepreneurs, mentors, facility bookings, and investor matching.');

doc.moveDown(0.25);
// Project 2
doc.font('Helvetica-Bold').fontSize(9).fillColor(darkColor).text('Document-Aware AI Assistant & ChatBot (RAG Architecture) ', { continued: true });
doc.font('Helvetica-Bold').fontSize(8).fillColor(primaryColor).text('[React, Express, Node.js, PostgreSQL, pgvector]');
doc.font('Helvetica').fontSize(8).fillColor(grayColor).text('Repo: github.com/negaromanzir-lab/ChatBot-app');
doc.font('Helvetica').fontSize(8.4).fillColor(darkColor).lineGap(1);
doc.text('• Built a production-ready conversational AI platform featuring Retrieval-Augmented Generation (RAG) over user-uploaded documents (PDF, DOCX, text).');
doc.text('• Implemented server-side vector embedding and top-K cosine similarity retrieval via PostgreSQL pgvector, scoping results strictly per user conversation.');
doc.text('• Provided real-time Server-Sent Events (SSE) streaming responses with browser abort signals and per-user daily usage quota enforcement.');

doc.moveDown(0.25);
// Project 3
doc.font('Helvetica-Bold').fontSize(9).fillColor(darkColor).text('Real-Time Employee Management System (EMS) ', { continued: true });
doc.font('Helvetica-Bold').fontSize(8).fillColor(primaryColor).text('[React Router 8, TypeScript, Express, MongoDB, Bun, Inngest]');
doc.font('Helvetica').fontSize(8).fillColor(grayColor).text('Repo: github.com/negaromanzir-lab/AI-Powered-Real-time-Employee-Management-System');
doc.font('Helvetica').fontSize(8.4).fillColor(darkColor).lineGap(1);
doc.text('• Engineered a modular workforce portal with 3-tier RBAC (Admin, Department Head, Employee) secured via httpOnly JWT cookies.');
doc.text('• Built clock-in/clock-out attendance logging, department leave policy approval pipelines, and task assignment tracking.');
doc.text('• Configured event-driven Inngest background workers to process automated operational insights without blocking the REST API.');

// ── Education & Verified Certifications ──
sectionHeading('Education & Verified Certifications');

doc.font('Helvetica-Bold').fontSize(9).fillColor(darkColor).text('Bachelor of Science in Computer Science ', { continued: true });
doc.font('Helvetica').fontSize(8).fillColor(grayColor).text('· Arba Minch University, Ethiopia (2024 – 2028, In Progress)');
doc.font('Helvetica').fontSize(8.4).fillColor(darkColor).text('• Core Coursework: Data Structures, Algorithms, Database Systems, Software Engineering, Computer Networks.');

doc.moveDown(0.2);
doc.font('Helvetica-Bold').fontSize(8.7).fillColor(darkColor).text('Udacity Nanodegree — Programming Fundamentals ', { continued: true });
doc.font('Helvetica').fontSize(8).fillColor(grayColor).text('· Completed July 18, 2025');
doc.font('Helvetica').fontSize(7.8).fillColor(grayColor).text('  Verification: udacity.com/certificate/e/9ed3f802-4510-11f0-9ce2-efed14404efb');

doc.moveDown(0.15);
doc.font('Helvetica-Bold').fontSize(8.7).fillColor(darkColor).text('Udacity Nanodegree — Android Developer Fundamentals ', { continued: true });
doc.font('Helvetica').fontSize(8).fillColor(grayColor).text('· Completed August 24, 2025');
doc.font('Helvetica').fontSize(7.8).fillColor(grayColor).text('  Verification: udacity.com/certificate/e/16f8e10a-63b4-11f0-b337-5f5de1371085');

doc.moveDown(0.15);
doc.font('Helvetica-Bold').fontSize(8.7).fillColor(darkColor).text('Udacity Nanodegree — Artificial Intelligence Fundamentals ', { continued: true });
doc.font('Helvetica').fontSize(8).fillColor(grayColor).text('· Completed August 27, 2025');
doc.font('Helvetica').fontSize(7.8).fillColor(grayColor).text('  Verification: udacity.com/certificate/e/3ecd5892-7849-11f0-8ae5-d366902f426e');

// ── Community ──
sectionHeading('Technical Outreach & Activities');
doc.font('Helvetica-Bold').fontSize(8.7).fillColor(darkColor).text('Technical Content Creator & Educator ', { continued: true });
doc.font('Helvetica').fontSize(8).fillColor(grayColor).text('· YouTube Channel (@negaromanzir) · 2023 – Present');
doc.font('Helvetica').fontSize(8.4).fillColor(darkColor).text('• Produce technical video tutorials covering JavaScript, full-stack web architectures, API integration, and ethical security fundamentals.');

doc.end();

writeStream.on('finish', () => {
    fs.copyFileSync(outputPath, path.join(__dirname, 'CV_Negaro_Manzir.pdf'));
    fs.copyFileSync(outputPath, path.join(assetsDir, 'Negaro_Manzir_Resume.pdf'));
    console.log('Single-page PDF generated successfully at:', outputPath);
});
