const registerButton = document.getElementById("registerButton");
const logInButton = document.getElementById("logInButton");
const tryGifBtn = document.getElementById("tryGifbtn");
const saveGifButton = document.getElementById("saveGifbtn");
const deleteGifButton = document.getElementById("deleteGifbtn");
const showSavedGifsBtn = document.getElementById("showSavedGifs");

const gifBox = document.getElementById("gif");
const savedGifBox = document.getElementById("savedGifs");
const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");
const closeMessageBtn = document.getElementById("closeMessageBtn");

const usernameInput = document.getElementById("username-Registration");
const passwordInput = document.getElementById("password-Registration");

let currentUser = null;
let currentGifUrl = null;

function showMessage(text) {
  messageText.textContent = text;
  messageBox.style.display = "block";
}

closeMessageBtn.addEventListener("click", function () {
  messageBox.style.display = "none";
});

registerButton.addEventListener("click", async function () {
  const username = usernameInput.value;
  const password = passwordInput.value;

  const userData = { username: username, password: password };

  const res = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  if (res.status === 200) {
    showMessage("Register succeeded!");
  } else if (res.status === 409) {
    showMessage("User already exists!");
  } else {
    showMessage("Registration failed.");
  }

  usernameInput.value = "";
  passwordInput.value = "";
});

logInButton.addEventListener("click", async function () {
  const username = document.getElementById("username-logIn").value.trim();
  const password = document.getElementById("password-logIn").value.trim();

  if (!username || !password) {
    alert("Fyll i både användarnamn och lösenord.");
    return;
  }

  const loginData = { username: username, password: password };

  const res = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData)
  });

  const data = await res.json();
  if (res.status === 200) {
    currentUser = username;
    showMessage("Login succeeded!");
  } else {
    showMessage("Login failed.");
  }

  document.getElementById("username-logIn").value = "";
  document.getElementById("password-logIn").value = "";
});

tryGifBtn.addEventListener("click", async function () {
  const apiKey = "AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8";
  const searchTerm = "sunny weather";
  const url = "https://tenor.googleapis.com/v2/search?q=" + searchTerm + "&key=" + apiKey + "&limit=1&random=true";

  const res = await fetch(url);
  const data = await res.json();

  currentGifUrl = data.results[0].media_formats.tinygif.url;
  gifBox.innerHTML = "";

  const img = document.createElement("img");
  img.src = currentGifUrl;
  img.style.width = "200px";
  gifBox.appendChild(img);
});

saveGifButton.addEventListener("click", async function () {
  if (!currentGifUrl || !currentUser) {
    alert("No GIF to save or user not logged in.");
    return;
  }

  const gifData = { gifUrl: currentGifUrl, username: currentUser };

  const res = await fetch("http://localhost:8000/save-gif", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gifData)
  });

  const result = await res.json();
  if (res.status === 200) {
    showMessage("GIF saved!");
  } else {
    showMessage("Could not save GIF.");
  }
});

deleteGifButton.addEventListener("click", async function () {
  if (!currentGifUrl || !currentUser) {
    alert("No GIF to delete or user not logged in.");
    return;
  }

  const gifData = { gifUrl: currentGifUrl, username: currentUser };

  const res = await fetch("http://localhost:8000/delete-gif", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gifData)
  });

  const data = await res.json();
  showMessage(data.message || "GIF deleted.");
});

showSavedGifsBtn.addEventListener("click", async function () {
  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

  const res = await fetch("http://localhost:8000/get-gifs?username=" + currentUser);
  const gifs = await res.json();

  savedGifBox.innerHTML = "";

  for (let i = 0; i < gifs.length; i++) {
    const url = gifs[i];
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = url;
    img.style.width = "100px";

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.addEventListener("click", async function () {
      const res = await fetch("http://localhost:8000/delete-gif", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gifUrl: url, username: currentUser })
      });

      const result = await res.json();
      alert(result.message);
      div.remove();
    });

    div.appendChild(img);
    div.appendChild(btn);
    savedGifBox.appendChild(div);
  }
});
