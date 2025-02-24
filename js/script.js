fetch("js/games.json")
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
