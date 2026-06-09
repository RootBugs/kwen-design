# 🎨 Kwen Design — Creative Digital Studio

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Responsive-ff69b4?style=for-the-badge" alt="Responsive">
  <img src="https://img.shields.io/badge/Glassmorphism-ffffff?style=for-the-badge&logoColor=black" alt="Glassmorphism">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/effestier/kwen-design?style=for-the-badge" alt="Stars">
  <img src="https://img.shields.io/github/forks/effestier/kwen-design?style=for-the-badge" alt="Forks">
  <img src="https://img.shields.io/github/issues/effestier/kwen-design?style=for-the-badge" alt="Issues">
  <img src="https://img.shields.io/github/license/effestier/kwen-design?style=for-the-badge" alt="License">
</p>

---

## 👁️ Live Preview

> **[🔗 Click here to view the live site](https://effestier.github.io/kwen-design/)**

---

## ✨ About

**Kwen Design** is a stunning, modern glassmorphism landing page built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies. It features animated gradient blobs, frosted glass cards, smooth scroll reveal animations, and a fully responsive design that works beautifully on all devices.

This project showcases a creative digital studio website with:
- Immersive glassmorphism UI design
- Animated background with floating gradient blobs
- Interactive mouse parallax and card tilt effects
- Smooth scroll-triggered reveal animations
- Fully functional contact form with validation
- Complete accessibility support (WCAG 2.1)

---

## 🎡 Features

| Feature | Description |
|---------|-------------|
| 🌟 **Glassmorphism UI** | Frosted glass cards with backdrop blur, gradient borders, and subtle shadows |
| 🌀 **Animated Background** | 5 floating gradient blobs with smooth CSS animations and grid overlay |
| 🔵 **Scroll Animations** | Elements reveal on scroll using IntersectionObserver (no jQuery!) |
| 🔢 **Counter Animation** | Stats count up with eased animation when scrolled into view |
| 🖱️ **Mouse Parallax** | Hero card follows cursor with 3D perspective transforms |
| 💨 **Card Tilt Effect** | Service cards tilt on hover with realistic 3D perspective |
| 📱 **Fully Responsive** | Seamless experience from 4K displays to mobile phones |
| 🔌 **Mobile Navigation** | Full-screen overlay menu with hamburger animation |
| 📝 **Contact Form** | Client-side validation, loading states, and success feedback |
| ♿ **Accessible** | Skip links, ARIA labels, prefers-reduced-motion, semantic HTML |
| 🚀 **Performance** | Throttled events, CSS-based animations, no inline styles |

---

## 📂 Sections

1. **Hero** — Bold headline with animated stats and a browser mockup preview
2. **Services** — 4 service cards (UI/UX, Web Dev, Branding, Mobile Apps) with tilt effects
3. **Portfolio** — Masonry-style grid showcasing 5 featured projects
4. **About** — Company info with feature highlights and a code mockup
5. **Testimonials** — 3 client reviews with star ratings
6. **Contact** — Working form with validation + contact info
7. **Footer** — Links, social icons, and copyright

---

## 📦 Project Structure

```
kwen-design/
├── index.html          # Main HTML file (semantic, accessible)
├── style.css           # All styles (glassmorphism, animations, responsive)
├── script.js           # Interactions (scroll reveal, parallax, form validation)
├── README.md           # This file
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/effestier/kwen-design.git
   cd kwen-design
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   start index.html        # Windows
   open index.html         # macOS
   xdg-open index.html     # Linux
   ```

3. **Or use a local server** (recommended for best experience)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Then visit http://localhost:8000
   ```

---

## 💡 How It Works

### Glassmorphism Effect
The signature glass look is achieved with:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Scroll Reveal
Uses `IntersectionObserver` for performant scroll-triggered animations:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
```

---

## 🎬 Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome  | ✅ Yes |
| Firefox | ✅ Yes |
| Safari  | ✅ Yes |
| Edge    | ✅ Yes |
| Opera   | ✅ Yes |

> ⚠️ `backdrop-filter` requires `-webkit-` prefix for Safari. Both are included.

---

## ♿ Accessibility

- **Skip to content** link for keyboard users
- **ARIA labels** on navigation, buttons, and interactive elements
- **Semantic HTML** with `<nav>`, `<main>`, `<section>`, `<footer>`
- **prefers-reduced-motion** disables all animations for users who need it
- **Form labels** (visually hidden) for screen reader compatibility
- **Focus states** visible on all interactive elements

---

## 💻 Tech Stack

- **HTML5** — Semantic markup with ARIA attributes
- **CSS3** — Custom properties, Grid, Flexbox, animations, backdrop-filter
- **Vanilla JavaScript** — No frameworks, no dependencies, pure JS
- **Google Fonts** — Inter + Space Grotesk

---

## ⚡ Performance

- **Zero dependencies** — No jQuery, no React, no build tools
- **Throttled scroll events** for smooth 60fps performance
- **CSS-based animations** with `will-change` hints
- **IntersectionObserver** instead of scroll event listeners
- **No inline styles from JS** — CSS classes only
- **Touch device detection** — Skips parallax/tilt on mobile

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

Designed & built by **[@effestier](https://github.com/effestier)**

<p align="center">
  <a href="https://github.com/effestier">
    <img src="https://github.com/effestier.png" width="100" style="border-radius: 50%;" alt="effestier">
  </a>
</p>

<p align="center">
  <b>Star ⭐ this repo if you found it useful!</b>
</p>

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/effestier">effestier</a></sub>
</p>
