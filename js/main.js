/* ============================================
   ELAF LEXISYNC — MAIN JAVASCRIPT
   ============================================ */
(function () {
  'use strict';

  /* ── NAVIGATION ── */
  function initNav() {
    const navEl = document.getElementById('nav');
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');
    const dropdownBtn = document.querySelector('.nav__link--dropdown');
    const dropdownMenu = document.querySelector('.nav__dropdown-menu');
    let overlay = null;

    // Create overlay element
    overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    // Hamburger toggle
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggleMenu(!isOpen);
      });

      overlay.addEventListener('click', function () {
        toggleMenu(false);
      });
    }

    function toggleMenu(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('nav__menu--open', open);
      overlay.classList.toggle('nav__overlay--visible', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    // Dropdown
    if (dropdownBtn && dropdownMenu) {
      dropdownBtn.addEventListener('click', function () {
        const isOpen = dropdownBtn.getAttribute('aria-expanded') === 'true';
        dropdownBtn.setAttribute('aria-expanded', String(!isOpen));
        dropdownMenu.classList.toggle('nav__dropdown-menu--open', !isOpen);
      });

      // Close dropdown on Escape
      dropdownBtn.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          dropdownBtn.setAttribute('aria-expanded', 'false');
          dropdownMenu.classList.remove('nav__dropdown-menu--open');
        }
      });

      // Desktop hover behavior
      var container = document.querySelector('.nav__dropdown-container');
      if (container) {
        container.addEventListener('mouseenter', function () {
          if (window.innerWidth >= 1024) {
            dropdownBtn.setAttribute('aria-expanded', 'true');
            dropdownMenu.classList.add('nav__dropdown-menu--open');
          }
        });
        container.addEventListener('mouseleave', function () {
          if (window.innerWidth >= 1024) {
            dropdownBtn.setAttribute('aria-expanded', 'false');
            dropdownMenu.classList.remove('nav__dropdown-menu--open');
          }
        });
      }
    }

    // Scroll state
    var sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none;';
    document.body.prepend(sentinel);

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        navEl.classList.toggle('nav--scrolled', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    navObserver.observe(sentinel);

    // Close menu on link click
    var navLinks = menu.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 1024) {
          toggleMenu(false);
        }
      });
    });
  }


  /* ── SMOOTH SCROLL ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var navHeight = document.getElementById('nav').offsetHeight;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }


  /* ── SCROLL SPY ── */
  function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__link[href^="#"]');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.remove('nav__link--active');
          });
          var id = entry.target.id;
          var activeLink = document.querySelector('.nav__link[href="#' + id + '"]');
          if (activeLink) {
            activeLink.classList.add('nav__link--active');
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -75% 0px',
      threshold: 0
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }


  /* ── SOLUTIONS TABS / ACCORDION ── */
  function initSolutions() {
    var tabs = document.querySelectorAll('.solutions__tab');
    var panels = document.querySelectorAll('.solutions__panel');

    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateTab(tab);
      });

      tab.addEventListener('keydown', function (e) {
        var index = Array.from(tabs).indexOf(tab);
        var last = tabs.length - 1;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          tabs[index < last ? index + 1 : 0].focus();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          tabs[index > 0 ? index - 1 : last].focus();
        }
        if (e.key === 'Home') {
          e.preventDefault();
          tabs[0].focus();
        }
        if (e.key === 'End') {
          e.preventDefault();
          tabs[last].focus();
        }
      });
    });

    function activateTab(selectedTab) {
      // Deactivate all
      tabs.forEach(function (t) {
        t.classList.remove('solutions__tab--active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      panels.forEach(function (p) {
        p.classList.remove('solutions__panel--active');
        p.hidden = true;
      });

      // Activate selected
      selectedTab.classList.add('solutions__tab--active');
      selectedTab.setAttribute('aria-selected', 'true');
      selectedTab.setAttribute('tabindex', '0');

      var panelId = selectedTab.getAttribute('aria-controls');
      var panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('solutions__panel--active');
        panel.hidden = false;
      }
    }

    // Set initial tabindex
    tabs.forEach(function (t, i) {
      t.setAttribute('tabindex', i === 0 ? '0' : '-1');
    });
  }


  /* ── SCROLL ANIMATIONS ── */
  function initAnimations() {
    var elements = document.querySelectorAll('[data-animate]');

    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el, i) {
      // Stagger animations for grid items
      var parent = el.parentElement;
      if (parent) {
        var siblings = parent.querySelectorAll('[data-animate]');
        if (siblings.length > 1) {
          var index = Array.from(siblings).indexOf(el);
          el.style.transitionDelay = (index * 100) + 'ms';
        }
      }
      observer.observe(el);
    });
  }


  /* ── COUNTER ANIMATION ── */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');

    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function format(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(0) + ',000,000+';
        if (num >= 1000) return num.toLocaleString();
        return String(num);
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = format(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = format(target);
        }
      }

      requestAnimationFrame(step);
    }
  }


  /* ── FORM VALIDATION ── */
  function initForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;

    var validators = {
      Full_Name: function (val) {
        if (!val.trim()) return 'Full name is required.';
        if (val.trim().length < 2) return 'Please enter at least 2 characters.';
        return '';
      },
      Company_Name: function (val) {
        if (!val.trim()) return 'Company name is required.';
        return '';
      },
      email: function (val) {
        if (!val.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
        return '';
      },
      Required_Solution: function (val) {
        if (!val) return 'Please select a solution.';
        return '';
      }
    };

    // Validate single field
    function validateField(field) {
      var name = field.name;
      if (!validators[name]) return true;

      var error = validators[name](field.value);
      var errorEl = field.closest('.form-group').querySelector('.form-error');

      if (error) {
        field.setAttribute('aria-invalid', 'true');
        if (errorEl) {
          errorEl.textContent = error;
          field.setAttribute('aria-describedby', errorEl.id || '');
        }
        return false;
      } else {
        field.removeAttribute('aria-invalid');
        if (errorEl) errorEl.textContent = '';
        return true;
      }
    }

    // Validate languages (checkbox group)
    function validateLanguages() {
      var checked = form.querySelectorAll('input[name="Target_Languages[]"]:checked');
      var errorEl = form.querySelector('.form-checkbox-group').closest('.form-group').querySelector('.form-error');
      if (checked.length === 0) {
        if (errorEl) errorEl.textContent = 'Please select at least one language.';
        return false;
      }
      if (errorEl) errorEl.textContent = '';
      return true;
    }

    // Blur validation
    form.querySelectorAll('input, select').forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });
    });

    // Submit handler
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;

      // Validate text/email/select fields
      form.querySelectorAll('input[required], select[required]').forEach(function (field) {
        if (!validateField(field)) isValid = false;
      });

      // Validate checkboxes
      if (!validateLanguages()) isValid = false;

      if (isValid) {
        // Allow form submission to FormSubmit.co
        form.submit();
      } else {
        // Scroll to first error
        var firstError = form.querySelector('[aria-invalid="true"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
    });
  }


  /* ── FILE UPLOAD ── */
  function initFileUpload() {
    var dropZone = document.getElementById('file-drop-zone');
    var fileInput = document.getElementById('file-upload');
    var preview = document.getElementById('file-preview');
    var fileName = document.getElementById('file-name');
    var removeBtn = document.getElementById('file-remove');

    if (!dropZone || !fileInput) return;

    var allowedTypes = ['.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.xliff', '.tmx'];
    var maxSize = 5 * 1024 * 1024; // 5MB (FormSubmit limit)

    // Click to browse
    dropZone.addEventListener('click', function () {
      fileInput.click();
    });

    // Drag and drop
    ['dragenter', 'dragover'].forEach(function (event) {
      dropZone.addEventListener(event, function (e) {
        e.preventDefault();
        dropZone.classList.add('dragging');
      });
    });

    ['dragleave', 'drop'].forEach(function (event) {
      dropZone.addEventListener(event, function (e) {
        e.preventDefault();
        dropZone.classList.remove('dragging');
      });
    });

    dropZone.addEventListener('drop', function (e) {
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', function () {
      if (fileInput.files.length) {
        handleFile(fileInput.files[0]);
      }
    });

    function handleFile(file) {
      var ext = '.' + file.name.split('.').pop().toLowerCase();
      var errorEl = dropZone.closest('.form-group').querySelector('.form-error');

      if (!allowedTypes.includes(ext)) {
        if (errorEl) errorEl.textContent = 'File type not allowed. Please use: ' + allowedTypes.join(', ');
        return;
      }

      if (file.size > maxSize) {
        if (errorEl) errorEl.textContent = 'File is too large. Maximum size is 5MB.';
        return;
      }

      if (errorEl) errorEl.textContent = '';

      // Show preview
      var sizeStr = file.size < 1024 * 1024
        ? (file.size / 1024).toFixed(1) + ' KB'
        : (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      fileName.textContent = file.name + ' (' + sizeStr + ')';
      preview.hidden = false;
      dropZone.style.display = 'none';
    }

    // Remove file
    if (removeBtn) {
      removeBtn.addEventListener('click', function () {
        fileInput.value = '';
        preview.hidden = true;
        dropZone.style.display = '';
      });
    }
  }


  /* ── INIT ALL ── */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initSmoothScroll();
    initScrollSpy();
    initSolutions();
    initAnimations();
    initCounters();
    initForm();
    initFileUpload();
  });
})();
