(function() {
  'use strict';

  // === Throttle utility ===
  function throttle(fn, wait) {
    let lastTime = 0;
    return function() {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }

  // === Check reduced motion ===
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // === Navbar Scroll Effect ===
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', throttle(function() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, 100));

  // === Active Nav Link ===
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function updateActiveLink() {
    let current = '';
    sections.forEach(function(section) {
      var sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', throttle(updateActiveLink, 100));

  // === Scroll Reveal Animation (CSS-based, no inline styles) ===
  var revealElements = document.querySelectorAll('.service-card, .work-card, .testimonial-card, .feature-item');
  if (prefersReducedMotion) {
    revealElements.forEach(function(el) { el.classList.add('visible'); });
  } else {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(function() { entry.target.classList.add('visible'); }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(function(el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // === Counter Animation ===
  var countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    document.querySelectorAll('.stat-number').forEach(function(counter) {
      var target = parseInt(counter.getAttribute('data-target'));
      var duration = 2000;
      var start = performance.now();
      function update(currentTime) {
        var elapsed = currentTime - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }
  if (prefersReducedMotion) {
    document.querySelectorAll('.stat-number').forEach(function(counter) {
      counter.textContent = counter.getAttribute('data-target');
    });
  } else {
    var statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    var statsSection = document.querySelector('.hero-stats');
    if (statsSection) statsObserver.observe(statsSection);
  }

  // === Handle tab visibility for counters ===
  document.addEventListener('visibilitychange', function() {
    if (document.hidden && countersAnimated) {
      document.querySelectorAll('.stat-number').forEach(function(counter) {
        counter.textContent = counter.getAttribute('data-target');
      });
    }
  });

  // === Mobile Menu (CSS class based) ===
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var navLinksContainer = document.getElementById('navLinks');
  if (mobileBtn && navLinksContainer) {
    mobileBtn.addEventListener('click', function() {
      var isOpen = navLinksContainer.classList.toggle('open');
      mobileBtn.classList.toggle('active');
      mobileBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close menu when clicking on the backdrop
    navLinksContainer.addEventListener('click', function(e) {
      if (e.target === navLinksContainer && navLinksContainer.classList.contains('open')) {
        navLinksContainer.classList.remove('open');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // === Smooth Scroll for Nav Links ===
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        // Close mobile menu if open
        if (navLinksContainer && navLinksContainer.classList.contains('open')) {
          navLinksContainer.classList.remove('open');
          mobileBtn.classList.remove('active');
          mobileBtn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // === Mouse Parallax on Hero Card (desktop only) ===
  if (!prefersReducedMotion && !isTouchDevice) {
    var heroCard = document.querySelector('.hero-card');
    if (heroCard) {
      var ticking = false;
      document.addEventListener('mousemove', function(e) {
        if (!ticking) {
          requestAnimationFrame(function() {
            var x = (e.clientX / window.innerWidth - 0.5) * 20;
            var y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroCard.style.transform = 'perspective(1000px) rotateY(' + (x * 0.3) + 'deg) rotateX(' + (-y * 0.3) + 'deg)';
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }

  // === Tilt Effect on Service Cards (desktop only) ===
  if (!prefersReducedMotion && !isTouchDevice) {
    document.querySelectorAll('.service-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / 20;
        var rotateY = (centerX - x) / 20;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }

  // === Contact Form with Validation ===
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(fieldId, message) {
    var group = document.getElementById(fieldId).closest('.form-group');
    var errorEl = document.getElementById(fieldId.replace('contact', '').toLowerCase() + 'Error');
    group.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(fieldId) {
    var group = document.getElementById(fieldId).closest('.form-group');
    var errorEl = document.getElementById(fieldId.replace('contact', '').toLowerCase() + 'Error');
    group.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  function clearAllErrors() {
    document.querySelectorAll('.form-group').forEach(function(g) { g.classList.remove('error'); });
    document.querySelectorAll('.form-error').forEach(function(e) { e.textContent = ''; });
  }

  if (contactForm) {
    // Live validation - clear errors on input
    ['contactName', 'contactEmail', 'contactMessage'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function() { clearError(id); });
      }
    });

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      clearAllErrors();
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      var name = document.getElementById('contactName');
      var email = document.getElementById('contactEmail');
      var message = document.getElementById('contactMessage');
      var valid = true;

      if (!name.value.trim()) {
        showError('contactName', 'Please enter your name.');
        valid = false;
      }
      if (!email.value.trim()) {
        showError('contactEmail', 'Please enter your email.');
        valid = false;
      } else if (!validateEmail(email.value)) {
        showError('contactEmail', 'Please enter a valid email address.');
        valid = false;
      }
      if (!message.value.trim()) {
        showError('contactMessage', 'Please tell us about your project.');
        valid = false;
      }

      if (!valid) return;

      // Simulate sending
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(function() {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        formStatus.textContent = 'Message sent successfully! We\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();

        setTimeout(function() {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 5000);
      }, 1500);
    });
  }
})();