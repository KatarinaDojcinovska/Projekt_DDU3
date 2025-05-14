const resultDiv = document.getElementById("results");

async function runWeatherTest() {
  const apiKey = "59a2034ae4aa4ce49c6215358251305";
  resultDiv.innerHTML += createTestBox("Hämtar plats...", "info");

  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude.toFixed(2);
    const lon = pos.coords.longitude.toFixed(2);

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);

      const data = await response.json();
      const location = data.location.name;
      const temp = data.current.temp_c;
      const condition = data.current.condition.text;

      resultDiv.innerHTML += createTestBox(
        `Väder i ${location}: ${temp} °C, ${condition}`,
        "success"
      );
    } catch (err) {
      resultDiv.innerHTML += createTestBox(`Fel: ${err.message}`, "error");
    }
  }, err => {
    resultDiv.innerHTML += createTestBox(`Kunde inte hämta plats: ${err.message}`, "error");
  });
}

function createTestBox(text, type) {
  const classMap = {
    success: "test success",
    error: "test error",
    info: "test"
  };
  return `<div class="${classMap[type]}">${text}</div>`;
}

runWeatherTest();










