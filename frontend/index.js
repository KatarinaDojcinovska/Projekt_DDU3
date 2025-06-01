import api from "./src/api/api.js";
import { Weather } from "./src/classes/Weather.js";

const compassDiv = document.getElementById("compass");
const tempEls = document.getElementsByClassName("weatherTemp");
const dag = document.getElementsByClassName("dag");
const registerButton = document.getElementById("register-button");
const registerUsernameInput = document.getElementById("register-username");
const registerPasswordInput = document.getElementById("register-password");
const loginButton = document.getElementById("login-button");
const loginUsernameInput = document.getElementById("login-username");
const loginPasswordInput = document.getElementById("login-password");
const popupWrapper = document.getElementById("popUPwrapper");
const cards = document.getElementsByClassName("card");
const savedGifsButton = document.getElementById("savedGifs");
const savedGifsBox = document.getElementById("savedGifsBox");
const savedGifsList = document.getElementById("savedGifsShell");
const weatherEmoji = document.querySelectorAll(".weatherEmoji");
const main = document.querySelector("main");
const headerHTML = document.querySelector("header");

const imagesByCondition = {
  cloudy: [
    "./assets/icons/Cloudy/cloudy1.png",
    "./assets/icons/Cloudy/cloudy2.png",
    "./assets/icons/Cloudy/cloudy3.png",
    "./assets/icons/Cloudy/cloudy4.png",
  ],
  rainy: [
    "./assets/icons/Rainy/rainy1.png",
    "./assets/icons/Rainy/rainy2.png",
    "./assets/icons/Rainy/rainy3.png",
    "./assets/icons/Rainy/rainy4.png",
  ],
  snow: [
    "./assets/icons/snow/snow1.png",
    "./assets/icons/snow/snow2.png",
    "./assets/icons/snow/snow3.png",
    "./assets/icons/snow/snow4.png",
  ],
  sunny: [
    "./assets/icons/Sunny/sunny1.png",
    "./assets/icons/Sunny/sunny2.png",
    "./assets/icons/Sunny/sunny3.png",
    "./assets/icons/Sunny/sunny4.png",
  ],
  thunder: [
    "./assets/icons/thunder/thunder1.png",
    "./assets/icons/thunder/thunder2.png",
    "./assets/icons/thunder/thunder3.png",
    "./assets/icons/thunder/thunder4.png",
  ],
};

function getRandomImageForCondition(condition) {
  const cond = condition.toLowerCase();
  const keys = Object.keys(imagesByCondition);

  let keyFound = null;
  for (let k = 0; k < keys.length; k++) {
    if (cond.includes(keys[k])) {
      keyFound = keys[k];
      break;
    }
  }

  let list;
  if (keyFound !== null) {
    list = imagesByCondition[keyFound];
  } else {
    list = imagesByCondition.cloudy;
  }

  const idx = Math.floor(Math.random() * list.length);
  const img = new Image();
  img.src = list[idx];
  return img;
}

function translateCondition(text) {
  let t = text.toLowerCase();
  if (t.includes("sun")) return "sunshine";
  if (t.includes("cloud")) return "cloudy";
  if (t.includes("rain")) return "rainy";
  if (t.includes("snow")) return "snowy";
  return "weather";
}

const displayGif = function (weather, index) {
  cards[index].addEventListener("click", async function () {
    if (!weather) return;

    const card = cards[index];
    const condition = weather.condition;
    const searchWord = translateCondition(condition);

    if (card.classList.contains("active")) {
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        c.classList.remove("active");
        c.classList.remove("inactive");
        c.querySelector(".weatherGIF").innerHTML = "";
      }
      return;
    }

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      c.classList.add("inactive");
      c.classList.remove("active");
      c.querySelector(".weatherGIF").innerHTML = "";
    }
    card.classList.add("active");
    card.classList.remove("inactive");

    const gifData = await api.getGif(searchWord);
    const gifUrl = gifData.results[0].media_formats.tinygif.url;

    const box = card.querySelector(".weatherGIF");

    const img = document.createElement("img");
    img.src = gifUrl;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save GIF";

    saveBtn.addEventListener("click", async function () {
      const user = localStorage.getItem("username");
      if (!user) {
        alert("You need to log in");
        return;
      }
      
      await api.saveGifToUser(user, gifUrl);

      if (savedGifsBox.style.display === "flex") {
        displaySavedGifs();
      }

      alert("GIF saved!")
    });

    box.appendChild(img);
    box.appendChild(saveBtn);
  });
};

const getCurrentPos = function () {
  const options = {
    enableHighAccuracy: false,
    timeout: Infinity,
    maximumAge: 0,
  };

  const success = function (pos) {
    const crd = pos.coords;
    localStorage.setItem("longitude", crd.longitude);
    localStorage.setItem("latitude", crd.latitude);
  };

  const error = (err) => {
    console.log(`ERROR(${err.code}): ${err.message}`);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
};

const displaySavedGifs = async function () {
  const user = localStorage.getItem("username");
  if (savedGifsBox.style.display === "flex") {
    savedGifsBox.style.display = "none";
    return;
  } else {
    savedGifsBox.style.display = "flex";
  }

  savedGifsList.innerHTML = "";
  const gifs = await api.getUserGifs(user);
  if (gifs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No saved GIFs";
    savedGifsList.appendChild(p);
    return;
  }

  for (let i = 0; i < gifs.length; i++) {
    let gifUrl = gifs[i];

    let wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.marginBottom = "10px";

    let img = document.createElement("img");
    img.src = gifUrl;
    img.style.maxWidth = "150px";

    let delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-gif";

    delBtn.addEventListener("click", async function () {
      let conf = confirm("Do you want to remove this GIF?");
      if (!conf) return;

      const res = await api.deleteGifOfUser(user, gifUrl);

      if (res.ok) {
        wrapper.remove();
        if (savedGifsList.children.length === 0) {
          savedGifsBox.style.display = "none";
        }
      }
    });

    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    savedGifsList.appendChild(wrapper);
  }
};

const displayForecast = function (weather, index) {
  tempEls[index].textContent = weather.temp + "°C";
  const dateObject = new Date(weather.date);
  const dayOfMonth = dateObject.getDate();
  const monthName = dateObject.toLocaleDateString("en-US", {
    month: "long",
  });
  dag[index].textContent = `${dayOfMonth} ${monthName}`;
};

window.addEventListener("load", function () {
  getCurrentPos();

  const currentLongitude = localStorage.getItem("longitude");
  const currentLatitude = localStorage.getItem("latitude");

  const loadForecastCards = async function () {
    try {
      const forecastData = await api.getForecast(
        currentLatitude,
        currentLongitude
      );

      const location = forecastData.location.name;
      const daysForecast = forecastData.forecast.forecastday;
      const currentDayForecast = forecastData.current;

      displayLocation(location, currentLatitude, currentLongitude);

      for (let index = 0; index < 3; index++) {
        let weather;
        if (index === 0) {
          weather = new Weather(
            location,
            currentDayForecast.temp_c,
            currentDayForecast.condition.text,
            daysForecast[0].date,
            currentLatitude,
            currentLongitude
          );
        } else {
          weather = new Weather(
            location,
            daysForecast[index].day.avgtemp_c,
            daysForecast[index].day.condition.text,
            daysForecast[index].date,
            currentLatitude,
            currentLongitude
          );
        }

        displayForecast(weather, index);
        displayGif(weather, index);
        const randomImage = getRandomImageForCondition(weather.condition);
        weatherEmoji[index].appendChild(randomImage);
      }
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  };

  savedGifsButton.addEventListener("click", function () {
    displaySavedGifs();
  });

  loadForecastCards();
});

async function displayLocation(location, lat, lon) {
  const p = document.createElement("p");
  p.textContent = `${location} ${lat}, ${lon}`;
  compassDiv.appendChild(p);
}

registerButton.addEventListener("click", async function () {
  if (!registerUsernameInput.value || !registerPasswordInput.value) {
    alert("Username or password doesnt exists");
  }
  const res = await api.register(
    registerUsernameInput.value,
    registerPasswordInput.value
  );

  if (res.ok) {
    popupWrapper.style.display = "none";
    main.style.display = "block";
    headerHTML.style.display = "flex";
  }
});

loginButton.addEventListener("click", async function () {
  if (!loginUsernameInput.value || !loginPasswordInput.value) {
    alert("Username or password doesnt exists");
  }

  const res = await api.login(
    loginUsernameInput.value,
    loginPasswordInput.value
  );

  if (res.ok) {
    popupWrapper.style.display = "none";
    main.style.display = "block";
    headerHTML.style.display = "flex";
  }
});

