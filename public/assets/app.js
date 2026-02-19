(function () {
  const SUPPORTED = ["en", "hu", "sv"];

  function getLangFromQuery() {
    const p = new URLSearchParams(window.location.search);
    const lang = (p.get("lang") || "").toLowerCase();
    return SUPPORTED.includes(lang) ? lang : null;
  }

  function getLangFromStorage() {
    const lang = (localStorage.getItem("lang") || "").toLowerCase();
    return SUPPORTED.includes(lang) ? lang : null;
  }

  function setLang(lang) {
    localStorage.setItem("lang", lang);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.location.href = url.toString();
  }

  function t(lang, key) {
    const dict = window.I18N?.[lang] || window.I18N?.en;
    return dict?.[key] ?? window.I18N?.en?.[key] ?? key;
  }

  function applyI18n(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(lang, key));
    });

    const langSelect = document.getElementById("langSelect");
    if (langSelect) {
      langSelect.value = lang;
      langSelect.addEventListener("change", (e) => setLang(e.target.value));
    }

    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function setActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav a[data-nav]").forEach((a) => {
      if (a.getAttribute("href").includes(path)) a.classList.add("active");
    });
  }

  function wireContactForm() {
    const form = document.getElementById("leadForm");
    const status = document.getElementById("formStatus");
    if (!form || !status) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const prevDisabled = submitBtn?.disabled;
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Form submit failed: ${res.status}`);
        }

        status.style.display = "block";
        status.scrollIntoView({ behavior: "smooth", block: "nearest" });
        form.reset();
      } catch (err) {
        console.error(err);
        alert("Sorry—something went wrong sending the form. Please try again or email us directly.");
      } finally {
        if (submitBtn) submitBtn.disabled = prevDisabled ?? false;
      }
    });
  }

  const lang = getLangFromQuery() || getLangFromStorage() || "en";
  setActiveNav();
  applyI18n(lang);
  wireContactForm();
})();