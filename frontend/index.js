// Så kan användningen av klassen weatherClass se ut (troligen det vi kommer att använda)

import { WeatherClass } from "./weatherClass.js";

window.addEventListener("load", function() {
  // 1) Skapa en instans med din API-nyckel
  var weather = new WeatherClass("59a2034ae4aa4ce49c6215358251305");

  weather.getWeather(function(err) {
    if (err) {
      console.log("Fel vid hämtning:", weather.error);
    } else {
      // All data finns nu i instansen
      console.log("Plats:    " + weather.location);
      console.log("Temp (C): " + weather.temp);
      console.log("Väder:    " + weather.condition);
      // Vi kan nu spara dessa i variabler, localStorage eller skicka vidare och appenda eller liknande
    }
  });
});
