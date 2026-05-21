(function () {
  const STORAGE_KEY = "lang";
  const DEFAULT_LANG = "ko";

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ko" || stored === "en") return stored;
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations(lang);
    updateToggleUI(lang);
    document.dispatchEvent(
      new CustomEvent("langchange", { detail: { lang } })
    );
  }

  function t(key, lang) {
    const dict = window.I18N && window.I18N[lang];
    if (!dict) return key;
    return dict[key] !== undefined ? dict[key] : key;
  }

  function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const attr = el.getAttribute("data-i18n-attr");
      const value = t(key, lang);
      if (attr) {
        el.setAttribute(attr, value);
      } else if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });
  }

  function updateToggleUI(lang) {
    const toggle = document.querySelector(".lang-toggle");
    if (!toggle) return;
    toggle.dataset.lang = lang;
    toggle.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.langBtn === lang);
    });
  }

  function initToggle() {
    const toggle = document.querySelector(".lang-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lang-btn]");
      if (!btn) return;
      setLang(btn.dataset.langBtn);
    });
  }

  window.getLang = getLang;
  window.setLang = setLang;
  window.t = function (key) {
    return t(key, getLang());
  };
  window.pickLocale = function (obj) {
    if (!obj || typeof obj !== "object") return obj;
    const lang = getLang();
    return obj[lang] !== undefined ? obj[lang] : obj.ko || obj.en || "";
  };

  document.addEventListener("DOMContentLoaded", () => {
    const lang = getLang();
    document.documentElement.lang = lang;
    applyTranslations(lang);
    updateToggleUI(lang);
    initToggle();
  });
})();
