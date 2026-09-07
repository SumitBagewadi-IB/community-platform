// Indiabulls Securities Community — frontend interactivity.
// No backend yet: this only drives UI state (composer modal, theme toggle,
// like buttons, mobile sidebar). Swap these handlers for real API calls once
// a Discourse instance is available.

(function () {
  const root = document.documentElement;
  const THEME_KEY = "ib-community-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    const btn = document.querySelector("[data-theme-toggle]");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark");
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (e) {
      /* private mode / storage blocked — fall back to light */
    }
    applyTheme(saved === "dark" ? "dark" : "light");

    const btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {
          /* ignore */
        }
      });
    }
  }

  function initComposer() {
    const modal = document.querySelector("[data-composer-modal]");
    if (!modal) return;
    const openers = document.querySelectorAll("[data-composer-open]");
    const closers = modal.querySelectorAll("[data-composer-close]");

    openers.forEach((el) =>
      el.addEventListener("click", () => modal.classList.add("open"))
    );
    closers.forEach((el) =>
      el.addEventListener("click", () => modal.classList.remove("open"))
    );
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  function initLikeButtons() {
    document.querySelectorAll("[data-like-button]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const liked = btn.classList.toggle("liked");
        const countEl = btn.querySelector("[data-like-count]");
        if (countEl) {
          const current = parseInt(countEl.textContent, 10) || 0;
          countEl.textContent = liked ? current + 1 : current - 1;
        }
      });
    });
  }

  function initMobileSidebar() {
    const toggle = document.querySelector("[data-sidebar-toggle]");
    const sidebar = document.querySelector(".sidebar");
    if (!toggle || !sidebar) return;
    toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initComposer();
    initLikeButtons();
    initMobileSidebar();
  });
})();
