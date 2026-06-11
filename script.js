/* =========================================================
   Portfolio — Chakira Aoujil
   JavaScript : interactions, animations, sécurité contacts
   Vanilla JS — léger, sans dépendance, sans latence.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Année du footer ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Barre de progression de lecture ---------- */
  var bar = document.getElementById("progressBar");
  var ticking = false;
  function updateProgress() {
    var h = document.documentElement;
    var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (bar) bar.style.width = (scrolled * 100).toFixed(1) + "%";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
  }, { passive: true });
  updateProgress();

  /* ---------- Ombre de la navigation au défilement ---------- */
  var nav = document.getElementById("nav");
  function navShadow() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", navShadow, { passive: true });
  navShadow();

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
    menu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }
  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fermer le menu");
    menu.classList.add("is-open");
    document.body.classList.add("nav-open");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      open ? closeMenu() : openMenu();
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    // Fermer en tapant à l'extérieur du menu (sur le voile)
    document.addEventListener("click", function (e) {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });
  }

  /* ---------- Photo : repli si l'image est absente ---------- */
  var photoImg = document.getElementById("profilePhoto");
  var photoWrap = photoImg ? photoImg.closest(".photo") : null;
  if (photoImg && photoWrap) {
    photoImg.addEventListener("error", function () {
      photoWrap.classList.add("is-fallback");
    });
    // si l'image n'a pas de dimensions une fois chargée -> repli
    if (photoImg.complete && photoImg.naturalWidth === 0) {
      photoWrap.classList.add("is-fallback");
    }
  }

  /* ---------- Révélation au défilement (IntersectionObserver) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Barres de langue (animées à l'apparition) ---------- */
  var bars = document.querySelectorAll(".bar > i");
  if ("IntersectionObserver" in window && bars.length) {
    var ioBars = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var lvl = entry.target.getAttribute("data-lvl") || "0";
          entry.target.style.width = lvl + "%";
          ioBars.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { ioBars.observe(b); });
  } else {
    bars.forEach(function (b) { b.style.width = (b.getAttribute("data-lvl") || "0") + "%"; });
  }

  /* ---------- Lien de navigation actif ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav__link");
  if ("IntersectionObserver" in window && sections.length) {
    var ioNav = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (l) {
            l.classList.toggle("is-active", l.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { ioNav.observe(s); });
  }

  /* ---------- Coordonnées : assemblées côté client ----------
     Les valeurs ne figurent PAS en clair dans le fichier index.html
     poussé sur GitHub : elles sont reconstituées ici à l'exécution.
     Cela limite l'aspiration automatique (bots / spam) du dépôt. */
  var emailUser = ["aoujil", "chakira"].join("");
  var emailDomain = ["gmail", "com"].join(".");
  var email = emailUser + String.fromCharCode(64) + emailDomain;

  var phoneParts = ["06", "66", "24", "37", "43"];
  var phoneDisplay = phoneParts.join(".");
  var phoneTel = "+33" + phoneParts.join("").substring(1); // format international

  var emailCard = document.getElementById("emailCard");
  var emailValue = document.getElementById("emailValue");
  if (emailCard && emailValue) {
    emailCard.setAttribute("href", "mailto:" + email);
    emailValue.textContent = email;
  }

  var phoneCard = document.getElementById("phoneCard");
  var phoneValue = document.getElementById("phoneValue");
  if (phoneCard && phoneValue) {
    phoneCard.setAttribute("href", "tel:" + phoneTel);
    phoneValue.textContent = phoneDisplay;
  }
})();
