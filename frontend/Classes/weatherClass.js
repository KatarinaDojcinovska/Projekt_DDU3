export class WeatherClass {
  constructor(apiKey) {
    // Din WeatherAPI-nyckel
    this.apiKey = apiKey;
    // Här sparas resultaten
    this.location = "";
    this.temp = null;
    this.condition = "";
    this.error = null;
  }
  // Hämtar position och väder, sparar i egenskaperna
  getWeather(callback) {
  let self = this;

  console.log("Försöker hämta plats...");

  // 1) Hämta geolocation
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      let lat = pos.coords.latitude.toFixed(2);
      let lon = pos.coords.longitude.toFixed(2);

      console.log("Plats funkar:", lat, lon);

      // 2) Hämta väder
      self.fetchWeather(lat, lon, callback);
    },
    function(err) {
      console.warn("Platsfel:", err.message);

      // 🔁 Fallback till Stockholm (valfritt)
      let fallbackLat = 59.33;
      let fallbackLon = 18.06;

      console.log("Använder fallback-plats: Stockholm");

      self.fetchWeather(fallbackLat, fallbackLon, callback);
    }
  );
}

// Separat metod för API-anrop
fetchWeather(lat, lon, callback) {
  let self = this;
  let url =
    "https://api.weatherapi.com/v1/current.json?key=" +
    self.apiKey +
    "&q=" +
    lat +
    "," +
    lon +
    "&aqi=no";

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Status " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      self.location = data.location.name;
      self.temp = data.current.temp_c;
      self.condition = data.current.condition.text;
      callback(null);
    })
      .catch(function (err) {
        self.error = err.message;
        callback(err);
    });
  }
}

/*
  // Hämtar position och väder, sparar i egenskaperna
  getWeather(callback) {
    let self = this;

    // 1) Hämta geolocation
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        let lat = pos.coords.latitude.toFixed(2);
        let lon = pos.coords.longitude.toFixed(2);

        // 2) Bygg URL och hämta från API
        let url = "https://api.weatherapi.com/v1/current.json?key="
          + self.apiKey
          + "&q="
          + lat + "," + lon
          + "&aqi=no";

        fetch(url)
          .then(function(response) {
            if (!response.ok) {
              throw new Error("Status " + response.status);
            }
            return response.json();
          })
          .then(function(data) {
            // 3) Spara utvalda fält
            self.location  = data.location.name;
            self.temp      = data.current.temp_c;
            self.condition = data.current.condition.text;
            callback(null);
          })
          .catch(function(err) {
            self.error = err.message;
            callback(err);
          });
      },
      function(err) {
        // Geolocation misslyckades
        self.error = err.message;
        callback(err);
      }
    );
  }
}
*/
