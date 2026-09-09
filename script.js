(function () {
  "use strict";

  // Sticky nav shadow on scroll
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (window.scrollY > 8) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll-reveal animations
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Stagger process steps and card grids slightly for a nicer reveal
  function stagger(selector, delayStep) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.style.transitionDelay = (i * delayStep) + "ms";
    });
  }
  stagger(".service-card.reveal", 90);
  stagger(".process-step.reveal", 90);
  stagger(".work-card.reveal", 70);
  stagger(".testimonial-card.reveal", 90);
  stagger(".price-card.reveal", 90);

  // Contact form: basic client-side handling
  // TODO: this currently submits via mailto (no backend). Replace with a real
  // form endpoint (e.g. Formspree, Netlify Forms, or a custom API) before launch.
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function () {
      note.textContent = "Opening your email client to send this — thanks for reaching out!";
    });
  }
})();
