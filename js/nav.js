document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Respect reduced-motion: stop the looping hero dot animation
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.querySelectorAll('.pulse-dot animateMotion').forEach(function (a) {
      a.setAttribute('repeatCount', '0');
    });
  }

  // Scroll-reveal: fade/lift elements into view once, skipped entirely if reduced motion
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  // Text size toggle, persisted across pages
  var textSizeBtn = document.getElementById('text-size-toggle');
  var htmlEl = document.documentElement;
  if (localStorage.getItem('bridge-text-lg') === '1') {
    htmlEl.classList.add('text-lg');
  }
  if (textSizeBtn) {
    textSizeBtn.addEventListener('click', function () {
      var isLg = htmlEl.classList.toggle('text-lg');
      localStorage.setItem('bridge-text-lg', isLg ? '1' : '0');
      textSizeBtn.setAttribute('aria-label', isLg ? 'Decrease text size' : 'Increase text size');
    });
  }

  // Back to top
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
});
