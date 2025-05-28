import { WeatherClass } from "./Classes/weatherClass.js";

 let weeklyData  = [];

window.addEventListener("load", function() {
  const weather    = new WeatherClass("59a2034ae4aa4ce49c6215358251305");
  const compassDiv = document.getElementById("compass");
  const tempEls    = document.getElementsByClassName("weatherTemp");

  // Spara dagens och veckans data
  let currentData = { location: "", temp: null, condition: "" };
 
  weather.getWeather(async function(err) {
    if (err) {
      console.error("Fel vid current-weather:", weather.error);
      return;
    }

    // ——— 1) Visa “current” ———
    currentData.location  = weather.location;
    currentData.temp      = weather.temp;
    currentData.condition = weather.condition;

    const p = document.createElement("p");
    p.textContent = `${currentData.location} ${weather.lat}${weather.lon}`;
    compassDiv.appendChild(p);

    // ——— 2) Hämta 7-dagars-forecast med async/await ———
    try {
      const forecastUrl =
        `https://api.weatherapi.com/v1/forecast.json?key=${weather.apiKey}` +
        `&q=${weather.lat},${weather.lon}` +
        `&days=7&aqi=no&alerts=no`;

      const res  = await fetch(forecastUrl);
      if (!res.ok) throw new Error("Status " + res.status);
      const data = await res.json();
      
      weeklyData = [];  // töm arrayen först
      const daysArray = data.forecast.forecastday;
      for (let i = 0; i < daysArray.length; i++) {
        const day = daysArray[i];
        weeklyData.push({
          date: day.date,
          temp: day.day.avgtemp_c,
          condition: day.day.condition.text
        });
      }
      // Fyll i alla dina <p class="weatherTemp">
      for (let i = 0; i < tempEls.length && i < weeklyData.length; i++) {
        tempEls[i].textContent = weeklyData[i].temp + "°C";
      }

      console.log("Current data:", currentData);
      console.log("Weekly data:", weeklyData);

    } catch (err) {
      console.error("Kunde inte hämta forecast:", err);
    }
  });
});

//Login/Registrering
let currentUser = localStorage.getItem("username");

//REGISTRERING
document.getElementById("register-button").addEventListener("click", async function () {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!username || !password) {
    alert("Fyll i användarnamn och lösenord.");
    return;
  }

  const res = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.status === 200) {
    localStorage.setItem("username", username);
    currentUser = username;
    alert("Registrering lyckades!");
    document.getElementById("popup").style.display = "none";
  } else if (res.status === 409) {
    alert("Användarnamnet finns redan.");
  } else {
    alert("Registreringen misslyckades.");
  }
});

//LOGIN
document.getElementById("login-button").addEventListener("click", async function () {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Fyll i både användarnamn och lösenord.");
    return;
  }

  const res = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.status === 200) {
    localStorage.setItem("username", username);
    currentUser = username;
    alert("Inloggning lyckades!");
    document.getElementById("popup").style.display = "none";
  } else if (res.status === 401) {
    alert("Fel lösenord.");
  } else if (res.status === 404) {
    alert("Användaren finns inte.");
  } else {
    alert("Inloggningen misslyckades.");
  }
});

// KLICKA o VISA GIF o SPARA GIF
let cards = document.getElementsByClassName("card");

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function () {
    if (!weeklyData[i] || !weeklyData[i].condition) return;

    let condition = weeklyData[i].condition;
    let searchWord = translateCondition(condition);

    let alreadyActive = cards[i].classList.contains("active");

    // Nollställ alla kort
    for (let j = 0; j < cards.length; j++) {
      cards[j].classList.remove("active");
      cards[j].classList.remove("inactive");
      cards[j].querySelector(".weatherGIF").innerHTML = "";
    }

    if (!alreadyActive) {
      cards[i].classList.add("active");

      for (let k = 0; k < cards.length; k++) {
        if (k !== i) cards[k].classList.add("inactive");
      }

      fetchGif(searchWord, function (gifUrl) {
        let box = cards[i].querySelector(".weatherGIF");

        let img = document.createElement("img");
        img.src = gifUrl;

        let saveBtn = document.createElement("button");
        saveBtn.textContent = "Save GIF";

        saveBtn.addEventListener("click", function () {
          let user = localStorage.getItem("username");
          if (!user) {
            alert("Du måste logga in först");
            return;
          }

          fetch("http://localhost:8000/save-gif", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, gifUrl: gifUrl })
          })
          .then(function (res) { return res.json(); })
          .then(function (data) { alert(data.message); });
        });

        box.appendChild(img);
        box.appendChild(saveBtn);
      });
    }
  });
}

function translateCondition(text) {
  let t = text.toLowerCase();
  if (t.includes("sun")) return "sunshine";
  if (t.includes("cloud")) return "cloudy";
  if (t.includes("rain")) return "rainy";
  if (t.includes("snow")) return "snowy";
  return "weather";
}

function fetchGif(word, callback) {
  let url = "https://tenor.googleapis.com/v2/search?q=" +
    word + "&key=AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8&limit=1&random=true";

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      let gifUrl = data.results[0].media_formats.tinygif.url;
      callback(gifUrl);
    })
    .catch(function (err) {
      console.log("GIF-fel:", err);
      callback("");
    });
}



