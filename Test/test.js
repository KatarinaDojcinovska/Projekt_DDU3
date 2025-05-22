//Klar till 99% lite språk ändring osv
const registerButton = document.querySelector("#registerButton");
const logInButton = document.getElementById("logInButton");
const tryGifBtn = document.querySelector("#tryGifbtn");
const saveGifButton = document.getElementById("saveGifbtn");
const deleteGifButton = document.getElementById("deleteGifbtn");

const gifBox = document.getElementById("gif");
const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");
const closeMessageBtn = document.getElementById("closeMessageBtn");
const usernameInput = document.querySelector("#username-Registration");
const passwordInput = document.querySelector("#password-Registration");

//register
async function register() {
  const username = usernameInput.value;
  const password = passwordInput.value;

  const response = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username, password: password}),
  });
  const result = await response.json();

  messageBox.style.display = "block";

  if (response.status === 200) {
    messageText.textContent = "Register succeeded!";
    usernameInput.value = "";
    passwordInput.value = "";
  } else if (response.status === 409) {
    messageText.textContent = "User already exists!";
    usernameInput.value = "";
    passwordInput.value = "";
  } else {
    messageText.textContent = result.error || "Registration failed";
  }
}

registerButton.addEventListener("click", register);

closeMessageBtn.addEventListener("click", function () {
  messageBox.style.display = "none";
});

//login
logInButton.addEventListener("click", async function () {
  const usernameInput = document.getElementById("username-logIn");
  const passwordInput = document.getElementById("password-logIn");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Vänligen fyll i både användarnamn och lösenord.");
    return;
  }

  usernameInput.value = "";
  passwordInput.value = "";

  let logInUser = JSON.stringify({
    userName: username,
    password: password,
  });

  const url = `http://localhost:8000/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: logInUser,
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Inloggning lyckades:", result);
    } else {
      console.error("Inloggning misslyckades:", result.error);
      alert("Inloggning misslyckades - användaren finns inte");
    }
  } catch (err) {
    console.error("Något gick fel:", err);
  }
});

//try hämta gif
let currentGifUrl = null;

async function bringGIF() {
  const apiKey = "AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8";
  const searchTerm = "sunny weather";
  const url = `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${apiKey}&limit=1&random=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    currentGifUrl = data.results[0].media_formats.tinygif.url;
    gifBox.innerHTML = "";

    const img = document.createElement("img");
    img.src = currentGifUrl;
    img.style.width = "200px";
    gifBox.appendChild(img);

    console.log("GIF hämtad:", currentGifUrl);
  } catch (err) {
    console.error("Fel vid GIF-hämtning:", err);
  }
}

tryGifBtn.addEventListener("click", bringGIF);

//saveGIF
saveGifButton.addEventListener("click", async function () {
  if (!currentGifUrl) {
    alert("Ingen GIF att spara.");
    return;
  }

  messageBox.style.display = "block";

  const gifUrl = JSON.stringify({ gifUrl: currentGifUrl });

  try {
    const response = await fetch("http://localhost:8000/save-gif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: gifUrl,
    });

    const result = await response.json();

    if (response.status === 200) {
      messageText.textContent = "GIF saved!";
    } else if (response.status === 404) {
      messageText.textContent = "User not found";
    } else {
      messageText.textContent = result.error;
    }
  } catch (err) {
    messageText.textContent = "Ett fel uppstod vid sparande.";
    console.error(err);
  }
});

closeMessageBtn.addEventListener("click", function () {
  messageBox.style.display = "none";
});

//delete
deleteGifButton.addEventListener("click", async function () {
  const response = await fetch("http:localhost:8000/delete-gif", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  messageBox.style.display = "block";

  const result = await response.json();

  if (response.status === 200) {
    messageText.textContent = "GIF Deleted";
  } else if (response.status === 404) {
    messageText.textContent = "User not found";
  } else {
    messageText.textContent = result.error;
  }
});
