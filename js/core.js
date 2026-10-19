// core.js — page bootstrap, navigation, theme, scroll reveal, scroll widgets.
// Loaded on every page after i18n.js. Page-specific modules are optional:
// the init list below calls whichever initialize* functions exist.

window.pydSupabaseReady = Promise.resolve(null);
if (
  document.body.classList.contains("page-account") ||
  document.body.classList.contains("page-template-workspace")
) {
  var coreScriptUrl = document.currentScript.src;
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Unable to load " + src));
      };
      document.head.appendChild(script);
    });
  }
  window.pydSupabaseReady = loadScript(
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
  )
    .then(function () {
      return loadScript(new URL("supabase-config.js", coreScriptUrl).href);
    })
    .then(function () {
      return loadScript(new URL("supabase.js", coreScriptUrl).href);
    })
    .then(function () {
      if (window.PYD_SUPABASE_ERROR) throw window.PYD_SUPABASE_ERROR;
      return window.pydSupabase;
    });
}

// ======================== INITIALIZATION ========================
// Content is hidden by CSS only while <html> has the "reveal-armed"
// class. We add it here (JS is alive) and always reveal everything as a
// failsafe, so a broken script can never leave a blank page.
document.documentElement.classList.add("reveal-armed");
window.addEventListener("load", function () {
  setTimeout(function () {
    var all = document.querySelectorAll("[data-reveal]");
    var shown = document.querySelectorAll("[data-reveal].revealed");
    if (all.length && shown.length === 0) {
      all.forEach(function (el) {
        el.classList.add("revealed");
      });
    }
  }, 1200);
});

document.addEventListener("DOMContentLoaded", function () {
  [
    "initializeNavigation",
    "initializeThemeToggle",
    "initializeScrollWidgets",
    "initializeTemplateFilters",
    "initializeTemplateWorkspace",
    "initializeScrollReveal",
    "initializeTilt",
    "initializeNavA11y",
    "initializeBackground",
    "initializeFormInlineValidation",
  ].forEach(function (name) {
    try {
      var fn = window[name];
      if (typeof fn === "function") fn();
    } catch (err) {
      console.warn("init step failed:", name, err);
    }
  });
});

// ======================== NAVIGATION ========================
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger) return;

  syncMenuToggle();

  hamburger.addEventListener("click", toggleMobileMenu);

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar")) closeMobileMenu();
  });

  // Close menu with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (navLinks && navLinks.classList.contains("active")) {
      closeMobileMenu();
      hamburger.focus();
    }
  });

  // Reset state when the desktop menu takes over
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });

  // Keep the accessible name in sync with the active language
  document.addEventListener("langchange", syncMenuToggle);
}

// Reflect open/closed state on the menu button for assistive tech
function syncMenuToggle() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger || !navLinks) return;
  const isOpen = navLinks.classList.contains("active");
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  hamburger.setAttribute("aria-label", t(isOpen ? "menu.close" : "nav.menu"));
}

function toggleMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
  syncMenuToggle();
}

function closeMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;
  navLinks.classList.remove("active");
  hamburger?.classList.remove("active");
  syncMenuToggle();
}

function showMessage(message, type, element) {
  if (!element) return;
  element.textContent = message;
  element.className = `form-message ${type}`;
}

// ======================== THEME TOGGLE ========================
function initializeThemeToggle() {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.title = t("theme.toggle");
  document.body.appendChild(themeToggle);

  // Keep the tooltip translated when the language changes
  document.addEventListener("langchange", () => {
    themeToggle.title = t("theme.toggle");
  });

  const savedTheme = localStorage.getItem("theme") || "light";
  const isDark = savedTheme === "dark";
  document.documentElement.classList.toggle("dark-mode", isDark);
  themeToggle.innerHTML = isDark ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    const nowDark = document.documentElement.classList.toggle("dark-mode");
    themeToggle.innerHTML = nowDark ? "☀️" : "🌙";
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  });
}

// ======================== SCROLL REVEAL ========================
function initializeScrollReveal() {
  // Add data-reveal to major elements
  const selectors = [
    ".feature-card",
    ".step",
    ".template-card",
    ".template-preview-card",
    ".about-card",
    ".contact-card",
    ".hero-text",
    ".hero-animation",
    ".section-title",
    ".section-subtitle",
  ];

  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", "");
        const delay = Math.min(i % 4, 3);
        if (delay > 0) el.setAttribute("data-reveal-delay", delay);
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    observer.observe(el);
  });
}


// ---- Back-to-top button + navbar scroll state ----
function initializeScrollWidgets() {
  var btn = document.querySelector(".back-to-top");
  if (!btn) {
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute(
      "aria-label",
      typeof t === "function" ? t("top.aria") : "Back to top",
    );
    btn.innerHTML = "&#8593;";
    document.body.appendChild(btn);
  }

  var navbar = document.querySelector(".navbar");

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    btn.classList.toggle("visible", y > 400);
    if (navbar) navbar.classList.toggle("is-scrolled", y > 10);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty("--scroll", max > 0 ? (y / max).toFixed(4) : "0");
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.addEventListener("langchange", function () {
    btn.setAttribute(
      "aria-label",
      typeof t === "function" ? t("top.aria") : "Back to top",
    );
  });
}


// ---- Navigation accessibility (hamburger state, Escape, resize) ----
function initializeNavA11y() {
  var hamburger = document.querySelector(".hamburger");
  var navLinks = document.querySelector(".nav-links");
  if (!hamburger || !navLinks) return;

  if (!navLinks.id) navLinks.id = "primary-nav";
  hamburger.setAttribute("aria-controls", navLinks.id);

  function sync() {
    var open =
      navLinks.classList.contains("active") ||
      navLinks.classList.contains("open") ||
      navLinks.classList.contains("show");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  sync();
  hamburger.addEventListener("click", function () {
    setTimeout(sync, 0);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      navLinks.classList.remove("active", "open", "show");
      sync();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      navLinks.classList.remove("active", "open", "show");
      sync();
    }
  });
}


// ---- Reveal safety: never stay hidden in a non-visible document ----
(function () {
  function revealInstant() {
    document.documentElement.classList.add("reveal-instant");
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("revealed");
    });
  }
  function check() {
    if (document.hidden) revealInstant();
  }
  check();
  document.addEventListener("visibilitychange", check);
  window.addEventListener("load", check);
})();


// ---- Gentle 3D tilt: pointer devices only, off for reduced motion ----
function initializeTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  function bind(el, area, max) {
    var raf = null;
    el.setAttribute("data-tilt", "");
    function reset() {
      if (raf) cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
    area.addEventListener("pointermove", function (e) {
      var r = area.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        el.style.setProperty("--ry", (px * max).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * max).toFixed(2) + "deg");
      });
    });
    area.addEventListener("pointerleave", reset);
  }

  var hero = document.querySelector(".hero");
  var page = document.querySelector(".hero-page");
  if (hero && page) bind(page, hero, 10);

  document
    .querySelectorAll(".tile, .feature-card, .template-card")
    .forEach(function (el) {
      bind(el, el, 6);
    });
}
