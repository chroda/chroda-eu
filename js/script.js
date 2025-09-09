document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeBtn = document.getElementById("theme-toggle");
  const langBtn = document.getElementById("language-toggle");

  const locale =
    localStorage.getItem("locale") ||
    (navigator.language && navigator.language.startsWith("ja") ? "ja" : "en");
  const theme = localStorage.getItem("theme") || "dark";

  const setMode = (m) => {
    body.classList.remove("light-mode", "dark-mode");
    body.classList.add(m === "light" ? "light-mode" : "dark-mode");
    localStorage.setItem("theme", m);
  };

  const injectSvg = (el, url) =>
    fetch(url)
      .then((r) => r.text())
      .then((svg) => {
        el.innerHTML = svg;
        el.querySelectorAll("svg [fill], svg [stroke]").forEach((n) => {
          n.removeAttribute("fill");
          n.removeAttribute("stroke");
        });
      })
      .catch(() => {});

  const tFrom = (dict, path) => {
    const parts = path.split(".");
    let v = dict;
    for (const p of parts) v = v && v[p];
    return v;
  };

  Promise.all([
    fetch("js/games.json").then((r) => r.json()),
    fetch("js/i18n.json")
      .then((r) => r.json())
      .catch(() => ({})),
    injectSvg(themeBtn, "images/svg/lamp.svg"),
    injectSvg(langBtn, "images/svg/language.svg"),
  ])
    .then(([franchises, i18n]) => {
      const t = (path, fallback = "") =>
        tFrom(i18n[locale] || {}, path) ??
        tFrom(i18n.en || {}, path) ??
        fallback;

      setMode(theme);
      themeBtn.setAttribute(
        "data-tooltip",
        theme === "light"
          ? t("theme.dark", "Dark Mode")
          : t("theme.light", "Light Mode")
      );
      themeBtn.addEventListener("click", () => {
        const newTheme = body.classList.contains("light-mode")
          ? "dark"
          : "light";
        setMode(newTheme);
        themeBtn.setAttribute(
          "data-tooltip",
          newTheme === "light"
            ? t("theme.dark", "Dark Mode")
            : t("theme.light", "Light Mode")
        );
      });

      langBtn.setAttribute("data-tooltip", t("language", "Switch Language"));
      langBtn.addEventListener("click", () => {
        const next = locale === "en" ? "ja" : "en";
        localStorage.setItem("locale", next);
        location.reload();
      });

      document.documentElement.lang = locale;
      document.title = t("meta.title", document.title);

      const h2 = document.querySelector(".content h2");
      if (h2) h2.textContent = t("sections.gamesPublished", h2.textContent);

      const linkedIn = document.querySelector(
        '.contact-info a[href*="linkedin.com"]'
      );
      if (linkedIn)
        linkedIn.textContent = t(
          "contact-info.contactLinkedIn",
          linkedIn.textContent
        );

      const xLink = document.querySelector('.contact-info a[href*="x.com"]');
      if (xLink)
        xLink.textContent = t("contact-info.followX", xLink.textContent);

      const bsky = document.querySelector('.contact-info a[href*="bsky.app"]');
      if (bsky)
        bsky.textContent = t("contact-info.followBsky", bsky.textContent);

      const basedP = Array.from(
        document.querySelectorAll(".contact-info > p")
      ).find((p) => !p.querySelector("a"));
      if (basedP)
        basedP.textContent = t("contact-info.basedIn", basedP.textContent);

      const grid = document.getElementById("game-grid");
      grid.innerHTML = "";

      franchises.forEach((franchise) => {
        const section = document.createElement("section");
        section.classList.add("franchise");

        const heading = document.createElement("h3");
        heading.className = "franchise-title";
        heading.textContent = t(
          `franchises.${franchise.franchise}`,
          franchise.franchise
        );
        heading.title = "Toggle";
        heading.addEventListener("click", () =>
          section.classList.toggle("collapsed")
        );
        section.appendChild(heading);

        const productGrid = document.createElement("div");
        productGrid.classList.add("product-grid");

        franchise.titles.forEach((game) => {
          const gTitle = t(`games.${game.title}`, game.title);
          const imgSrc =
            locale === "ja" && game.image_ja ? game.image_ja : game.image;

          const item = document.createElement("div");
          item.className = "game-container";

          const announcedLabel = t("tags.announced", "ANNOUNCED");
          const badge = game.announced
            ? `<span class="badge-announced">${announcedLabel}</span>`
            : "";

          item.innerHTML = `
            <a class="link" href="${game.url}" target="_blank" rel="noopener" title="${gTitle}">
              ${badge}
              <h3 class="title">${gTitle}</h3>
              <img src="${imgSrc}" alt="${gTitle}" loading="lazy" decoding="async">
            </a>
          `;
          productGrid.appendChild(item);
        });

        const count = franchise.titles.length;
        const itemsPerRow =
          count <= 2 ? 2 : count === 3 ? 3 : count <= 4 ? 4 : 3;
        productGrid.classList.add(`items-${itemsPerRow}`);

        section.appendChild(productGrid);
        grid.appendChild(section);
      });
    })
    .catch((err) => console.error(err));
});
