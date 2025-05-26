import { WeatherClass } from "./Classes/weatherClass.js";

window.addEventListener("load", function() {
  let weather = new WeatherClass("59a2034ae4aa4ce49c6215358251305");

  const compassDiv = document.getElementById("compass");

  // 3) Kör hämtningen
  weather.getWeather(function(err) {
    if (err) {
      console.log("Fel vid hämtning:", weather.error);
    } else {
      const locationName    = weather.location;
      const temperatureC    = weather.temp;
      const weatherCondition = weather.condition;

      // 4) Skapa ett <p>-element och visa platsen i #compass
      const p = document.createElement("p");
      p.textContent = weather.location;
      compassDiv.appendChild(p);
    }
  });
});
