// ========== WEATHER ========== //
const apiKey = "8125c0f8f254ea12a212f9b10c0124e7";
const city = "Lagos";

// Fetch current weather
async function loadWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("current-temp").textContent = `${data.main.temp}°C`;
        document.getElementById("weather-desc").textContent = data.weather[0].description;
    } catch (err) {
        console.error("Weather error:", err);
    }
}

loadWeather();

// ========== SPOTLIGHT MEMBERS ========== //
async function loadSpotlights() {
    const res = await fetch("data/members.json");
    const data = await res.json();

    // Filter Gold + Silver
    const spotlightMembers = data.members.filter(
        (member) => member.membership === "Gold" || member.membership === "Silver"
    );

    // Randomize
    const selected = spotlightMembers
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    const container = document.getElementById("spotlight-container");
    container.innerHTML = "";

    selected.forEach((member) => {
        const card = document.createElement("div");
        card.className = "spotlight-card";

        card.innerHTML = `
      <img src="${member.image}" alt="${member.name}">
      <h3>${member.name}</h3>
      <p class="level">${member.membership} Member</p>
      <p>${member.address}</p>
      <a href="${member.website}" target="_blank">${member.website}</a>
    `;

        container.appendChild(card);
    });
}

loadSpotlights();

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
