
//LOG IN OCH REGISTER
const button2 = document.getElementById("logInButton");
const gifBox = document.getElementById("gif");
const tryGifBtn = document.querySelector(".try-Gif button");
const deleteButton = document.getElementById("deleteGif");
const saveButton = document.getElementById("saveGif");
const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");
const closeMessageBtn = document.getElementById("closeMessageBtn")


button2.addEventListener("click", async function () {
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

deleteButton.addEventListener("click", async function () {
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

