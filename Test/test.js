//Klar till 99% lite språk ändring osv
const registerButton = document.querySelector("#registerButton");
const logInButton = document.getElementById("logInButton");
let currentUser = null;

const showSavedGifsBtn = document.getElementById("showSavedGifs");
const savedGifBox = document.getElementById("savedGifs");
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
    body: JSON.stringify({ username: username, password: password}),
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
      username: username, 
      password: password
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
  messageBox.style.display = "block";


    if (response.status === 200) {
      messageText.textContent = "Login succeeded!";
      currentUser = username;
      console.log("Inloggning lyckades:", result);
    } else {
      messageText.textContent = "Login failed!";
      console.error("Inloggning misslyckades:", result.error);
     //alert("Inloggning misslyckades - användaren finns inte");
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
  if (!currentGifUrl || !currentUser) {
    alert("No GIF to save or user not logged in.");
    return;
  }

  messageBox.style.display = "block";

  const gifData = JSON.stringify({
    gifUrl: currentGifUrl,
    username: currentUser
  });

  try {
    const response = await fetch("http://localhost:8000/save-gif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: gifData,
    });

    const result = await response.json();

    if (response.status === 200) {
      messageText.textContent = "GIF saved!";
    } else if (response.status === 404) {
      messageText.textContent = "User not found";
    } else {
      messageText.textContent = result.error || "Unknown error";
    }
  } catch (err) {
    messageText.textContent = "Error while saving GIF.";
    console.error(err);
  }
});


closeMessageBtn.addEventListener("click", function () {
  messageBox.style.display = "none";
});

//delete
deleteGifButton.addEventListener("click", async function () {
  if (!currentGifUrl || !currentUser) {
    alert("No GIF to delete or user not logged in.");
    return;
  }

  const gifData = JSON.stringify({
    gifUrl: currentGifUrl,
    username: currentUser
  });

  try {
    const response = await fetch("http://localhost:8000/delete-gif", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: gifData,
    });

    const result = await response.json();
    messageBox.style.display = "block";

    if (response.status === 200) {
      messageText.textContent = "GIF deleted!";
    } else if (response.status === 404) {
      messageText.textContent = "User not found";
    } else {
      messageText.textContent = result.error || "Unknown error";
    }
  } catch (err) {
    messageText.textContent = "Error while deleting GIF.";
    console.error(err);
  }
});

showSavedGifsBtn.addEventListener("click", async () => {
  if (!currentUser) {
    alert("Please log in first to see saved GIFs.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/get-gifs?username=${currentUser}`);
    const gifs = await response.json();
    if (!Array.isArray(gifs)) {
      alert("Could not load saved GIFS.");
      return;
    }

    savedGifBox.innerHTML = ""; // Clear previous

    gifs.forEach(url => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      img.src = url;
      img.style.width = "100px";

      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.onclick = async () => {
        const res = await fetch("http://localhost:8000/delete-gif", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gifUrl: url, username: currentUser })
        });

        const result = await res.json();
        alert(result.message);
        div.remove(); // Remove from view
      };

      div.appendChild(img);
      div.appendChild(btn);
      savedGifBox.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching saved GIFs:", err);
  }
});

