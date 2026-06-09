(function() {
  'use strict';

  // === UTILITY ===
  function throttle(fn, limit) {
    var inThrottle;
    return function() {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        fn.apply(context, args);
        inThrottle = true;
        setTimeout(function() { inThrottle = false; }, limit);
      }
    };
  }
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  var formStatusTimeout = null;

  // === BODY JS-LOADED CLASS ===
  document.body.classList.add('js-loaded');

  // === NAVBAR SCROLL ===
  var navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', throttle(function() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, 100));

  // === ACTIVE NAV LINK ===
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', throttle(function() {
    var current = '';
    sections.forEach(function(section) {
      var sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }, 100));

  // === MOBILE MENU ===
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var navLinksContainer = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', function() {
      var isOpen = navLinksContainer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinksContainer.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinksContainer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    navLinksContainer.addEventListener('click', function(e) {
      if (e.target === navLinksContainer) {
        navLinksContainer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // === SMOOTH SCROLL ===
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // === SCROLL REVEAL ===
  if (!prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, parseInt(delay));
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // === COUNTER ANIMATIONS ===
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    var target = parseInt(el.getAttribute('data-target'));
    var duration = 2000;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var statNumbers = document.querySelectorAll('.stat-number, .stat-big-number');
  if (statNumbers.length) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function(el) { counterObserver.observe(el); });
  }

  // === MOUSE PARALLAX (desktop only) ===
  if (!isTouchDevice && !prefersReducedMotion) {
    var heroCard = document.querySelector('.hero-card');
    if (heroCard) {
      document.addEventListener('mousemove', throttle(function(e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 20;
        var y = (e.clientY / window.innerHeight - 0.5) * 20;
        heroCard.style.transform = 'translateY(-6px) rotateY(' + x + 'deg) rotateX(' + (-y) + 'deg)';
      }, 16));
    }
    // Service card tilt
    document.querySelectorAll('.service-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-6px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }

  // === PORTFOLIO FILTERS ===
  var filterBtns = document.querySelectorAll('.filter-btn');
  var workCards = document.querySelectorAll('.work-card');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      workCards.forEach(function(card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          card.style.display = '';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });

  // === TESTIMONIAL SLIDER ===
  var testimonialTrack = document.getElementById('testimonialTrack');
  var testimonialDotsContainer = document.getElementById('testimonialDots');
  if (testimonialTrack && testimonialDotsContainer) {
    var testimonialCards = testimonialTrack.querySelectorAll('.testimonial-card');
    var currentTestimonial = 0;
    var totalTestimonials = testimonialCards.length;

    // Create dots
    for (var i = 0; i < totalTestimonials; i++) {
      var dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.dataset.index = i;
      dot.addEventListener('click', function() {
        goToTestimonial(parseInt(this.dataset.index));
      });
      testimonialDotsContainer.appendChild(dot);
    }

    function goToTestimonial(index) {
      currentTestimonial = index;
      var offset = -index * (testimonialCards[0].offsetWidth + 24);
      testimonialTrack.style.transform = 'translateX(' + offset + 'px)';
      testimonialDotsContainer.querySelectorAll('.testimonial-dot').forEach(function(d, i) {
        d.classList.toggle('active', i === index);
      });
    }

    document.querySelector('.testimonial-prev').addEventListener('click', function() {
      goToTestimonial(currentTestimonial > 0 ? currentTestimonial - 1 : totalTestimonials - 1);
    });
    document.querySelector('.testimonial-next').addEventListener('click', function() {
      goToTestimonial(currentTestimonial < totalTestimonials - 1 ? currentTestimonial + 1 : 0);
    });

    // Auto-advance
    if (!prefersReducedMotion) {
      setInterval(function() {
        goToTestimonial(currentTestimonial < totalTestimonials - 1 ? currentTestimonial + 1 : 0);
      }, 6000);
    }
  }

  // === FAQ ACCORDION ===
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item.active').forEach(function(openItem) {
        openItem.classList.remove('active');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });
      // Open clicked
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // === NEWSLETTER FORM ===
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var emailInput = newsletterForm.querySelector('input[type="email"]');
      var status = document.getElementById('newsletterStatus');
      var email = emailInput.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'newsletter-status';
        status.style.color = '#ef4444';
        return;
      }
      var btn = newsletterForm.querySelector('button');
      btn.disabled = true;
      btn.innerHTML = '<span>Subscribing...</span>';
      setTimeout(function() {
        status.textContent = 'Welcome aboard! Check your inbox for confirmation.';
        status.className = 'newsletter-status';
        status.style.color = '#34d399';
        emailInput.value = '';
        btn.disabled = false;
        btn.innerHTML = '<span>Subscribe</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }, 1200);
    });
  }

  // === CONTACT FORM ===
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    function clearAllErrors() {
      contactForm.querySelectorAll('.form-group').forEach(function(g) { g.classList.remove('error'); });
      contactForm.querySelectorAll('.form-error').forEach(function(e) { e.textContent = ''; });
    }
    function clearError(fieldId) {
      var errorId = fieldId.replace('contact', '').toLowerCase() + 'Error';
      var errorEl = document.getElementById(errorId);
      var group = document.getElementById(fieldId).closest('.form-group');
      if (errorEl) errorEl.textContent = '';
      if (group) group.classList.remove('error');
    }
    function showError(fieldId, message) {
      var errorId = fieldId.replace('contact', '').toLowerCase() + 'Error';
      var errorEl = document.getElementById(errorId);
      var group = document.getElementById(fieldId).closest('.form-group');
      if (errorEl) errorEl.textContent = message;
      if (group) group.classList.add('error');
    }
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Live validation - clear errors on input
    ['contactName', 'contactEmail', 'contactService', 'contactMessage'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function() { clearError(id); });
        el.addEventListener('change', function() { clearError(id); });
      }
    });

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      clearAllErrors();
      var valid = true;
      var name = document.getElementById('contactName').value.trim();
      var email = document.getElementById('contactEmail').value.trim();
      var service = document.getElementById('contactService').value;
      var message = document.getElementById('contactMessage').value.trim();
      if (!name) { showError('contactName', 'Please enter your name.'); valid = false; }
      if (!email) { showError('contactEmail', 'Please enter your email.'); valid = false; }
      else if (!validateEmail(email)) { showError('contactEmail', 'Please enter a valid email.'); valid = false; }
      if (!service) { showError('contactService', 'Please select a service.'); valid = false; }
      if (!message) { showError('contactMessage', 'Please enter your message.'); valid = false; }
      if (!valid) return;

      var submitBtn = document.getElementById('submitBtn');
      var formStatus = document.getElementById('formStatus');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      if (formStatusTimeout) clearTimeout(formStatusTimeout);

      setTimeout(function() {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        formStatus.textContent = 'Message sent successfully! We\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
        clearAllErrors();

        formStatusTimeout = setTimeout(function() {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 5000);
      }, 2000);
    });
  }

  // === TYPING EFFECT ON HERO (subtle) ===
  var heroBadge = document.querySelector('.hero-badge');
  if (heroBadge && !prefersReducedMotion) {
    var badgeText = heroBadge.textContent;
    heroBadge.textContent = '';
    var charIndex = 0;
    function typeBadge() {
      if (charIndex < badgeText.length) {
        heroBadge.textContent += badgeText[charIndex];
        charIndex++;
        setTimeout(typeBadge, 30);
      }
    }
    setTimeout(typeBadge, 500);
  }

  // === BACK TO TOP (shows after scroll) ===
  var backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 16V4M10 4L5 9M10 4L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.style.cssText = 'position:fixed;bottom:32px;right:32px;width:48px;height:48px;border-radius:50%;background:rgba(167,139,250,0.9);color:white;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:999;opacity:0;transform:translateY(20px);transition:all 0.3s ease;backdrop-filter:blur(10px);';
  document.body.appendChild(backToTop);
  window.addEventListener('scroll', throttle(function() {
    if (window.scrollY > 500) {
      backToTop.style.opacity = '1';
      backToTop.style.transform = 'translateY(0)';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.transform = 'translateY(20px)';
    }
  }, 100));
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

})();
