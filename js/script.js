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
      "data-tooltip",
      newTheme === "light" ? "Dark Mode" : "Light Mode"
    );
  });
});
fetch("js/games.json")
  .then((response) => response.json())
  .then((games) => {
    const grid = document.getElementById("game-grid");
    games.forEach((game) => {
      const item = `
                <div class="game-container">
                  <a class="link" href="${game.url}" target="_blank" title="${game.title}">
                    <h3 class="title">${game.title}</h3>
                    <img src="${game.image}" alt="${game.title}">
                  </a>
                </div>
            `;
      grid.innerHTML += item;
    });
    const itemCount = grid.children.length;
    const productGrid = document.querySelector(".product-grid");
    let itemsPerRow;
    if (itemCount <= 6) itemsPerRow = 3;
    else if (itemCount <= 8) itemsPerRow = 4;
    else itemsPerRow = 5;
    productGrid.className = `product-grid items-${itemsPerRow}`;
  })
  .catch((error) => console.error("Error loading games: ", error));
