# Negaro Manzir - Personal Portfolio Website

A modern, responsive personal portfolio website showcasing my skills, projects, and experience as a Full-Stack Web Developer and Computer Science student.

Visit my portfolio: [https://negaromanzir-lab.vercel.app/]

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=for-the-badge)]([(https://negaromanzir-lab.vercel.app/)])

## 🌟 Features

- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Animated Hero Section** - Dynamic typewriter effect cycling through titles: Application Developer, Coder, Youtuber, Hacker/Penetration Tester, Web/Software Developer
- **Interactive Resume** - Tabbed interface showing Experience, Education, Skills, and About Me
- **Portfolio Showcase** - Carousel displaying 6 projects with live demo and GitHub links
- **Contact Form** - Functional email integration using EmailJS
- **Smooth Animations** - CSS animations and transitions throughout
- **Custom Favicon** - "NM" branded SVG favicon

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3 (Custom animations, Flexbox, Grid)
- JavaScript (ES6+)
- [Boxicons](https://boxicons.com/) - Icon library

### Backend Integration
- [EmailJS](https://www.emailjs.com/) - Contact form email delivery

## 📂 Project Structure

```
complite portifolio/
├── css/
│   └── style.css          # Main stylesheet with animations
├── js/
│   └── script.js          # Navigation, portfolio carousel, contact form
├── images/
│   ├── syber-2.png        # Profile image
│   ├── portfolio1-6.jpg   # Project screenshots
│   └── favicon.png        # Browser icon
├── info/                  # Reference implementation
│   ├── index.html
│   └── styles.css
├── index.html             # Main HTML file
└── README.md              # Project documentation
```

## 🎨 Sections

### 1. Home
- Greeting with animated role titles
- Profile image with rotating border animation
- Brief introduction
- Download CV button
- Social media links (GitHub, LinkedIn, Discord, YouTube)

### 2. Services
- Web Development
- UI/UX Design
- Graphic Design
- SEO
- Video Editing
- Penetration Testing

### 3. Resume
Four interactive tabs:
- **Experience** - Freelance work, content creation, projects
- **Education** - University degree, online courses, certifications
- **Skills** - 14 technologies (HTML5, CSS3, JavaScript, TypeScript, React.js, Node.js, Python, Java, MySQL, MongoDB, Tailwind CSS, Git & GitHub, C++, PHP)
- **About Me** - Personal information and contact details

### 4. Portfolio
- 6 project cards with carousel navigation
- Each project includes:
  - Project number and title
  - Description
  - Technology stack
  - Live demo link
  - GitHub repository link

### 5. Contact
- Contact information (Phone, Email, Address)
- Clickable links:
  - Phone number opens dialer
  - Email opens mail client
  - Address opens Google Maps
- Contact form with EmailJS integration
- Real-time form validation
- Success/error feedback messages

## 🚀 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/negaromanzir-lab/portfolio.git
   cd portfolio
   ```

2. **Configure EmailJS**
   - Sign up at [emailjs.com](https://www.emailjs.com/)
   - Create an email service (Gmail)
   - Create an email template with variables: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`
   - Copy your credentials and update `js/script.js`:
     ```javascript
     const EMAILJS_SERVICE_ID  = 'your_service_id';
     const EMAILJS_TEMPLATE_ID = 'your_template_id';
     const EMAILJS_PUBLIC_KEY  = 'your_public_key';
     ```

3. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # or use a local server:
   npx serve
   ```

## 📧 Contact Form Setup

The contact form uses EmailJS to send emails directly from the browser without a backend server.

**Template Variables Required:**
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{phone}}` - Sender's phone number
- `{{subject}}` - Email subject
- `{{message}}` - Message body

**To Email:** Set to `negaromanzir@gmail.com` in the EmailJS template settings.

## 🎯 Key Features Explained

### Animated Role Titles
Uses CSS animations with `--i` custom properties to cycle through 5 roles every 4 seconds (20s total loop):
```css
animation: display-text 20s linear infinite;
animation-delay: calc(-4s * var(--i));
```

### Portfolio Carousel
JavaScript-controlled image slider with left/right navigation:
- Automatic transform transitions
- Synchronized image and detail panels
- Disabled state on boundaries

### Responsive Navigation
- Mobile hamburger menu
- Active link highlighting based on scroll position
- Smooth scroll behavior

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔗 Connect With Me

- **Email:** [negaromanzir@gmail.com](mailto:negaromanzir@gmail.com)
- **Phone:** [(+251) 931 457 595](tel:+251931457595)
- **GitHub:** [@negaromanzir-lab](https://github.com/negaromanzir-lab)
- **YouTube:** [@negaromanzir](https://youtube.com/@negaromanzir?si=j_PjmGOeZbHo1fbT)
- **Location:** Ambo, Ethiopia (Open to Remote Work)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from various portfolio websites
- Icons by [Boxicons](https://boxicons.com/)
- Email service by [EmailJS](https://www.emailjs.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

**Built with ❤️ by Negaro Manzir**

*Last Updated: July 2026*
