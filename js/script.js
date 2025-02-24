document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const currentTheme = localStorage.getItem("theme") || "dark";
  body.classList.remove("light-mode");
  body.classList.remove("dark-mode");
  body.classList.add(currentTheme === "light" ? "light-mode" : "dark-mode");
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    body.classList.toggle("dark-mode");
    const newTheme = body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    themeToggle.setAttribute(
      "title",
      newTheme === "light" ? "Dark Mode" : "Light Mode"
    );
  });
});

fetch("games.json")
  .then((response) => response.json())
  .then((games) => {
    const grid = document.getElementById("game-grid");
    games.forEach((game) => {
      const item = `
                <div class="product-item">
                    <a class="link" href="${game.url}" target="_blank" title="${game.title}">
                        <img src="${game.image}" alt="${game.title}">
                    </a>
                    <div class="title">${game.title}</div>
                </div>
            `;
      grid.innerHTML += item;
    });
  })
  .catch((error) => console.error("Error loading games:", error));
