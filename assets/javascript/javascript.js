(function () {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.getElementById("site-nav");

  function setMenu(open) {
    if (!toggle || !panel) return;
    panel.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      setMenu(!panel.classList.contains("is-open"));
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenu(false);
      }
    });

    document.addEventListener("click", function (event) {
      if (!header || !panel.classList.contains("is-open")) return;
      if (!header.contains(event.target)) {
        setMenu(false);
      }
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
