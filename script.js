// ===== Elements =====
const themeButton = document.getElementById("themeButton");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

const cityNameEl = document.getElementById("cityName");
const temperatureEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const weatherIconEl = document.getElementById("weatherIcon");

const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const errorEl = document.getElementById("error");

// ===== Events =====
themeButton.addEventListener("click", toggleTheme);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  if (!city) return;

  loadCity(city);
  cityInput.value = "";
});

// ===== Start =====
loadCity("Oslo");

// ===== Theme =====
function toggleTheme() {
  const isDark = document.body.classList.contains("theme-dark");

  document.body.classList.toggle("theme-dark", !isDark);
  document.body.classList.toggle("theme-light", isDark);

  if (isDark) {
    themeIcon.src = "./images/bedtime.svg";
    themeLabel.textContent = "Dark mode";
  } else {
    themeIcon.src = "./images/clear-day.svg";
    themeLabel.textContent = "Light mode";
  }
}

// ===== Controller =====
async function loadCity(city) {
  hideError();
  setLoadingState();

  try {
    const place = await getCoords(city);
    if (!place) return showNotFound();

    const data = await getWeather(place.lat, place.lon);
    renderWeather(data, place.name, place.country);
  } catch (err) {
    console.log(err);
    showError("Could not load weather right now.");
  }
}

function setLoadingState() {
  cityNameEl.textContent = "Loading...";
  temperatureEl.textContent = "--";
  conditionEl.textContent = "";
  humidityEl.textContent = "--";
  windEl.textContent = "--";
  weatherIconEl.src = "./images/cloud.svg";
}

// ===== API: city -> coordinates =====
async function getCoords(city) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?" +
    new URLSearchParams({ name: city, count: 1 });

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");

  const data = await res.json();
  const place = data.results?.[0];
  if (!place) return null;

  return {
    name: place.name,
    country: place.country,
    lat: place.latitude,
    lon: place.longitude,
  };
}

// ===== API: coordinates -> weather =====
async function getWeather(lat, lon) {
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
  if (!res.ok) throw new Error("Weather failed");

  return res.json();
}

// ===== Render =====
function renderWeather(data, cityName, country) {
  const current = data.current_weather;

  // 1. City
  cityNameEl.textContent = `${cityName}, ${country}`;

  // 2. Weather icon + condition
  const info = getWeatherInfo(current.weathercode);
  weatherIconEl.src = info.icon;
  conditionEl.textContent = info.text;

  // 3. Temperature
  temperatureEl.textContent = `${current.temperature}°C`;

  // 4. Humidity
  const humidity = data.hourly?.relativehumidity_2m?.[0] ?? null;
  humidityEl.textContent = humidity === null ? "--" : `${humidity}%`;

  // 5. Wind
  windEl.textContent = `${current.windspeed} km/h`;
}

// ===== Weather mapping =====
function getWeatherInfo(code) {
  if (code === 0) return { text: "Clear sky", icon: "./images/clear-day.svg" };
  if (code === 1 || code === 2)
    return { text: "Partly cloudy", icon: "./images/partly_cloudy_day.svg" };
  if (code === 3) return { text: "Overcast", icon: "./images/cloud.svg" };
  if (code >= 45 && code <= 48)
    return { text: "Foggy", icon: "./images/foggy.svg" };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    return { text: "Rain", icon: "./images/rainy.svg" };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86))
    return { text: "Snow", icon: "./images/weather_snowy.svg" };
  if (code >= 95)
    return { text: "Thunderstorm", icon: "./images/thunderstorm.svg" };

  return { text: "Unknown", icon: "./images/cloud.svg" };
}

// ===== Errors =====
function showNotFound() {
  cityNameEl.textContent = "Not found";
  temperatureEl.textContent = "--";
  conditionEl.textContent = "No data";
  humidityEl.textContent = "--";
  windEl.textContent = "--";
  weatherIconEl.src = "./images/cloud.svg";
  showError("City not found. Try another name.");
}

function showError(message) {
  errorEl.hidden = false;
  errorEl.textContent = message;
}

function hideError() {
  errorEl.hidden = true;
  errorEl.textContent = "";
}
