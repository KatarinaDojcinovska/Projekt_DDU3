//Hantera presentation av data från en api

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
