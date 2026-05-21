(function () {
  const TIERS = [
    { id: "title", key: "sponsors.tier.title" },
    { id: "premier", key: "sponsors.tier.premier" },
    { id: "supporter", key: "sponsors.tier.supporter" },
    { id: "inkind", key: "sponsors.tier.inkind" },
  ];

  function renderTier(tierId, sponsors) {
    const section = document.querySelector(`[data-tier="${tierId}"]`);
    if (!section) return;
    const grid = section.querySelector(".sponsor-tier__grid");
    const filtered = sponsors.filter((s) => s.tier === tierId);

    if (filtered.length === 0) {
      section.classList.add("is-hidden");
      return;
    }

    section.classList.remove("is-hidden");
    grid.innerHTML = "";

    filtered.forEach((s) => {
      const blurb = window.pickLocale ? window.pickLocale(s.blurb) : "";
      const card = document.createElement("a");
      card.className = "sponsor-card";
      card.href = s.url || "#";
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.innerHTML = `
        <div class="sponsor-card__logo">
          <img src="${s.logo}" alt="${s.name}" loading="lazy">
        </div>
        <h3 class="sponsor-card__name">${s.name}</h3>
        <p class="sponsor-card__blurb">${blurb}</p>
        <span class="sponsor-card__meta">SINCE ${s.since || "—"}</span>
      `;
      grid.appendChild(card);
    });
  }

  function render() {
    const sponsors = window.SPONSORS || [];
    TIERS.forEach(({ id }) => renderTier(id, sponsors));

    document.querySelectorAll("[data-tier] .sponsor-tier__title").forEach((el) => {
      const tier = el.closest("[data-tier]").dataset.tier;
      const key = TIERS.find((t) => t.id === tier)?.key;
      if (key && window.t) el.textContent = window.t(key);
    });
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("langchange", render);
})();
