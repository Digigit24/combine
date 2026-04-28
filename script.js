/* ==================================================================
   THE DIGITECH SOLUTIONS · Portfolio JS
   Handles:
     1. Light/Dark theme toggle (with localStorage + system preference)
     2. Dynamic copyright year
     3. Scroll reveal animation for cards/sections
     4. Smooth active-section tracking in the nav
   ================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "tds-theme";
  const root = document.documentElement;

  /* ----- 1. Theme ----- */
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)");

  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return prefersLight.matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "light" ? "#F7F8FB" : "#070B16");
    }
  }

  applyTheme(getInitialTheme());

  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  // React to system changes if the user hasn't chosen manually
  prefersLight.addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "light" : "dark");
    }
  });

  /* ----- 2. Year ----- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- 3. Scroll reveal ----- */
  const targets = document.querySelectorAll(
    ".project-card, .service-card, .review-card, .process-list li, .pillar-card, .reel-card, .section-head, .hero-inner > *"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ----- 3b. Mobile nav drawer ----- */
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");
  const navBackdrop = document.getElementById("navBackdrop");

  function closeNav() {
    document.body.classList.remove("is-nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  }
  function openNav() {
    document.body.classList.add("is-nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close menu");
    }
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      if (document.body.classList.contains("is-nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close when a nav link is tapped
    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    // Close when backdrop is tapped
    if (navBackdrop) {
      navBackdrop.addEventListener("click", closeNav);
    }

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("is-nav-open")) {
        closeNav();
      }
    });

    // Auto-close if the viewport grows past the mobile breakpoint
    const mql = window.matchMedia("(min-width: 961px)");
    mql.addEventListener("change", (e) => {
      if (e.matches) closeNav();
    });
  }

  /* ----- 4. Active nav link ----- */
  const navLinks = document.querySelectorAll(".primary-nav a");
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            const link = document.querySelector(
              `.primary-nav a[href="#${entry.target.id}"]`
            );
            if (link) link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }
})();
