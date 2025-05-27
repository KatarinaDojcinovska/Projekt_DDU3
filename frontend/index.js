
// Så kan användningen av klassen weatherClass se ut (troligen det vi kommer att använda)
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


