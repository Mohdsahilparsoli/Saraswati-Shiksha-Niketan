/* =========================================================================
   Saraswati Shiksha Niketan Inter College — Main JS
   ========================================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    });
  }

  /* ---------- Mobile navigation ---------- */
 var hamburger = document.querySelector('.hamburger');
var mobileNav = document.querySelector('.mobile-nav');
var overlay = document.querySelector('.overlay');
var closeBtn = document.querySelector('.mobile-close');

if (hamburger && mobileNav && overlay) {

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    overlay.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Toggle Menu
  hamburger.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('is-open');

    overlay.classList.toggle('is-open', isOpen);

    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on Nav Link Click
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Overlay Click
  overlay.addEventListener('click', closeMenu);

  // Close Button Click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close on ESC Key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

}

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.getAttribute('data-counter'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var counterIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { counterIO.observe(c); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Testimonial slider ---------- */
  var slides = document.querySelectorAll('.testimonial-slide');
  var dotsWrap = document.querySelector('.slider-dots');
  if (slides.length && dotsWrap) {
    var current = 0;
    dotsWrap.innerHTML = '';
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { showSlide(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('button');
    function showSlide(i) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }
    setInterval(function () { showSlide(current + 1); }, 6000);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));

      // Close siblings within the same accordion group
      var group = btn.closest('.accordion');
      if (group) {
        group.querySelectorAll('.accordion-trigger').forEach(function (other) {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });
      }

      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Gallery filters ---------- */
  var filterButtons = document.querySelectorAll('.gallery-filters button');
  var galleryItems = document.querySelectorAll('.masonry-item');
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox && galleryItems.length) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('.lightbox-caption');
    var visibleItems = function () { return Array.prototype.filter.call(galleryItems, function (i) { return !i.classList.contains('is-hidden'); }); };
    var lbIndex = 0;

    function openLightbox(item) {
      var items = visibleItems();
      lbIndex = items.indexOf(item);
      renderLightbox(items);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function renderLightbox(items) {
      var item = items[lbIndex];
      var img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = img.alt;
    }
    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () { openLightbox(item); });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', function () {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    });
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () {
      var items = visibleItems();
      lbIndex = (lbIndex - 1 + items.length) % items.length;
      renderLightbox(items);
    });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () {
      var items = visibleItems();
      lbIndex = (lbIndex + 1) % items.length;
      renderLightbox(items);
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('is-open');
      if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
      if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
    });
  }

  /* ---------- Form validation ---------- */
  function validateField(field) {
    var input = field.querySelector('input, textarea, select');
    if (!input) return true;
    var valid = input.checkValidity();
    if (input.hasAttribute('data-phone')) {
      var digits = input.value.replace(/\D/g, '');
      valid = valid && digits.length >= 10;
    }
    field.classList.toggle('has-error', !valid);
    return valid;
  }

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var fields = form.querySelectorAll('.field');
    fields.forEach(function (field) {
      var input = field.querySelector('input, textarea, select');
      if (input) {
        input.addEventListener('blur', function () { validateField(field); });
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });
      var successMsg = form.querySelector('.form-success');
      if (allValid) {
        if (successMsg) {
          successMsg.classList.add('is-visible');
          successMsg.textContent = 'Thank you. Your form has been submitted — our admissions team will contact you shortly.';
        }
        form.reset();
        fields.forEach(function (field) { field.classList.remove('has-error'); });
      } else if (successMsg) {
        successMsg.classList.remove('is-visible');
      }
    });
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector('.fab-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Current year in footer ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
