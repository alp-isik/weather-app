# Weather App

A small weather app that shows the current conditions for any city. Built with plain HTML, CSS and JavaScript on top of the free [Open-Meteo](https://open-meteo.com) API, with no libraries, no build step and no API key.

**Live demo:** https://alp-isik.github.io/weather-app/

## Features

- Search for any city by name
- Current temperature, weather condition, humidity and wind speed
- A matching icon for each condition (clear, cloudy, fog, rain, snow, thunderstorm)
- Light and dark theme toggle
- Loading state while a request is in progress
- Clear messages when a city isn't found or the request fails
- Opens on Oslo by default

## How it works

Each search makes two requests to Open-Meteo:

1. The **geocoding API** turns the city name into coordinates.
2. The **forecast API** returns the current weather and humidity for those coordinates.

The numeric weather code in the response is mapped to a short description and an icon before the page is updated.

## Running it locally

1. Clone the repository:
   ```bash
   git clone https://github.com/alp-isik/weather-app.git
   ```
2. Open `index.html` in your browser.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Page markup: search form, weather card and theme button |
| `style.css` | Layout and the light and dark themes |
| `script.js` | Search handling, API requests, rendering and error handling |
| `images/` | Weather and interface icons (SVG) |
