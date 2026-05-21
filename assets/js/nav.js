(function () {
  const path = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === path ||
      (path === "" && href === "index.html") ||
      (path === "index.html" && href === "index.html")
    ) {
      link.classList.add("is-active");
    }
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("is-open");
      nav.classList.toggle("is-open");
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        toggle.classList.remove("is-open");
        nav.classList.remove("is-open");
      });
    });
  }
})();
