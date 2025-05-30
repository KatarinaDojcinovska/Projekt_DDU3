// weatherClass.js
export class WeatherClass {
  constructor(apiKey) {
    this.apiKey    = apiKey;
    this.location  = "";
    this.temp      = null;
    this.condition = "";
    this.error     = null;
    this.lat       = null;  
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


