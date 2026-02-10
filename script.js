// ===== Elements =====
const themeBtn = document.getElementById("themeBtn");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cityText = document.querySelector(".city-text");
const tempText = document.querySelector(".temp-text");
const condText = document.querySelector(".cond-text");
const wxIcon = document.querySelector(".wx-icon");

const humidityValue = document.getElementById("humidityValue");
const windValue = document.getElementById("windValue");

// ===== Event listeners =====
themeBtn.addEventListener("click", toggleTheme);

searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleSearch();
});

// ===== Start =====
getWeatherForCity("Oslo");

// ===== UI actions =====
function toggleTheme() {
  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    document.body.classList.replace("dark", "light");
    themeBtn.innerHTML =
      '<img src="./images/bedtime.svg" width="20" alt=""> Dark Mode';
  } else {
    document.body.classList.replace("light", "dark");
    themeBtn.innerHTML =
      '<img src="./images/clear-day.svg" width="20" alt=""> Light Mode';
  }
}

function handleSearch() {
  const city = searchInput.value.trim();
  if (city === "") return;
  getWeatherForCity(city);
}

// ===== Main logic =====
async function getWeatherForCity(cityName) {
  try {
    const coords = await fetchCoords(cityName);

    if (coords === null) {
      showNotFound();
      return;
    }

    const data = await fetchWeather(coords.latitude, coords.longitude);
    updateUI(data, coords.name, coords.country);
  } catch (error) {
    console.log(error);
    condText.textContent = "Error loading weather";
  }
}

// ===== API calls =====
async function fetchCoords(cityName) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?" +
    new URLSearchParams({
      name: cityName,
      count: 1,
    });

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding request failed");

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const place = data.results[0];

  return {
    name: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

async function fetchWeather(lat, lon) {
  const url =
    "https://api.open-meteo.com/v1/forecast?" +
    new URLSearchParams({
      latitude: lat,
      longitude: lon,
      timezone: "auto",
      current_weather: "true",
      hourly: "relativehumidity_2m",
    });

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather request failed");

  return await res.json();
}

// ===== UI update =====
function updateUI(data, cityName, countryName) {
  const current = data.current_weather;

  cityText.textContent = cityName + ", " + countryName;
  tempText.textContent = current.temperature + "°C";
  windValue.textContent = current.windspeed + " km/h";

  // Humidity comes from hourly arrays, so we match the current time to the hourly time list.
  const times = data.hourly.time;
  const humidities = data.hourly.relativehumidity_2m;
  const index = times.indexOf(current.time);

  if (index !== -1) {
    humidityValue.textContent = humidities[index] + "%";
  } else {
    humidityValue.textContent = "--";
  }

  const code = current.weathercode;
  condText.textContent = describeWeatherCode(code);
  wxIcon.src = pickIconForWeather(code);
}

function showNotFound() {
  cityText.textContent = "Not found";
  tempText.textContent = "--";
  condText.textContent = "No data";
  humidityValue.textContent = "--";
  windValue.textContent = "--";
  wxIcon.src = "./images/cloud.svg";
}

// ===== Weather helpers =====
function describeWeatherCode(code) {
  if (code === 0) return "Clear sky";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Foggy";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return "Drizzle / Rain";
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return "Snow";
  }
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}

function pickIconForWeather(code) {
  if (code === 0) return "./images/clear-day.svg";
  if (code === 1 || code === 2) return "./images/partly_cloudy_day.svg";
  if (code === 3) return "./images/cloud.svg";
  if (code >= 45 && code <= 48) return "./images/foggy.svg";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return "./images/rainy.svg";
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return "./images/weather_snowy.svg";
  }
  if (code >= 95) return "./images/thunderstorm.svg";
  return "./images/cloud.svg";
}
