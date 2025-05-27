// weatherClass.js
export class WeatherClass {
  constructor(apiKey) {
    this.apiKey    = apiKey;
    this.location  = "";
    this.temp      = null;
    this.condition = "";
    this.error     = null;
    this.lat       = null;  // <--- lägg till
    this.lon       = null;
  }

  getWeather(callback) {
    const self = this;
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        // spara dessa för senare forecast
        self.lat = pos.coords.latitude;
        self.lon = pos.coords.longitude;

        // hämta “current weather”
        self.fetchWeather(self.lat, self.lon, callback);
      },
      function(err) {
        // fallback
        self.lat = 59.33;
        self.lon = 18.06;
        self.fetchWeather(self.lat, self.lon, callback);
      }
    );
  }

  fetchWeather(lat, lon, callback) {
    const self = this;
    const url =
      `https://api.weatherapi.com/v1/current.json?key=${self.apiKey}` +
      `&q=${lat},${lon}&aqi=no`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Status " + res.status);
        return res.json();
      })
      .then(data => {
        self.location  = data.location.name;
        self.temp      = data.current.temp_c;
        self.condition = data.current.condition.text;
        callback(null);
      })
      .catch(err => {
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
