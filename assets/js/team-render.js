(function () {
  const ROLE_KEYS = {
    principal: "team.role.principal",
    design: "team.role.design",
    manufacturing: "team.role.manufacturing",
    graphic: "team.role.graphic",
    resource: "team.role.resource",
    marketing: "team.role.marketing",
  };

  function render() {
    const grid = document.getElementById("crew-grid");
    if (!grid || !window.TEAM) return;

    grid.innerHTML = "";
    const lang = window.getLang ? window.getLang() : "ko";

    window.TEAM.forEach((member) => {
      const roleLabel = window.t
        ? window.t(ROLE_KEYS[member.role] || member.role)
        : member.role;
      const name = window.pickLocale
        ? window.pickLocale(member.name)
        : member.name.ko;
      const duty = window.pickLocale
        ? window.pickLocale(member.duty)
        : member.duty.ko;

      const card = document.createElement("article");
      card.className = "crew-card";
      card.innerHTML = `
        <div class="crew-card__photo">
          <img src="${member.photo}" alt="${name}" width="320" height="400" loading="lazy">
        </div>
        <div class="crew-card__body">
          <span class="crew-card__role">${roleLabel}</span>
          <h2 class="crew-card__name">${name}</h2>
          <p class="crew-card__duty">${duty}</p>
          <div class="crew-card__tools">
            ${(member.tools || [])
              .map((tool) => `<span class="tool-tag">${tool}</span>`)
              .join("")}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("langchange", render);
})();
