
async function writeMessage(response, elementClass) {
  const targetElement = document.querySelector(`.${elementClass}`);
  if (!targetElement) return;

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: "No message from server." };
  }

  const pElement = document.createElement("p");
  const prefix = response.ok ? "Success" : "Error";

  const message =
    data.message || data.error || data.detail || JSON.stringify(data);

  pElement.textContent = `${prefix} | Status: ${response.status} | Message: ${message}`;
  targetElement.appendChild(pElement);
}

const gifBox = document.getElementById("gif");

async function testRun() {
  const username = "sunny";
  const password = "moon";
  const username2 = "cloudy"; 
  let gifUrl;

  try {

    // Första registrering - ska fungera
    const registerResponse = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    await writeMessage(registerResponse, "register");

    // Förväntat fel: användarnamnet finns redan
    const registerResponse2 = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    await writeMessage(registerResponse2, "register");

    // Inloggning
    const loginResponse = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    await writeMessage(loginResponse, "Login");

    // Saknar username → 400
    const loginResponse2 = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }), // username saknas
    });
    await writeMessage(loginResponse2, "Login");

    // Felaktigt username → 404
    const loginResponse3 = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username2, password }),
    });
    await writeMessage(loginResponse3, "Login");

    // Felaktigt lösenord → 401
    const password2 = "heythere";
    const loginResponse4 = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: password2 }),
    });
    await writeMessage(loginResponse4, "Login");

    // Hämta GIF från Tenor
    const apiKey = "AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8";
    const searchTerm = "sunny weather";
    const gifResponse = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${apiKey}&limit=1&random=true`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const gifData = await gifResponse.json();
    gifUrl = gifData.results[0].media_formats.tinygif.url;

    const gifBox = document.getElementById("gif");
    gifBox.innerHTML = "";
    const img = document.createElement("img");
    img.src = gifUrl;
    img.style.width = "200px";
    gifBox.appendChild(img);

    const fakeSuccessResponse = new Response(
      JSON.stringify({ message: "GIF hämtad" }),
      { status: 200 }
    );
    await writeMessage(fakeSuccessResponse, "try-gif");

    // Spara GIF till backend
    const saveResponse = await fetch("http://localhost:8000/save-gif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, gifUrl }),
    });
    await writeMessage(saveResponse, "save-Gif");

    //Gif ska ge felmeddalnde - användaren finns inte
    const saveResponse2 = await fetch("http://localhost:8000/save-gif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username2, gifUrl }),
    });
    await writeMessage(saveResponse2, "save-Gif");

    // Radera GIF
    const deleteResponse = await fetch("http://localhost:8000/delete-gif", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, gifUrl }),
    });
    await writeMessage(deleteResponse, "delete-Gif");

    //Ska ge felmeddelande - användaren finns inte
    const deleteResponse2 = await fetch("http://localhost:8000/delete-gif", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username2, gifUrl }),
    });
    await writeMessage(deleteResponse2, "delete-Gif");


    // Login utan password
    const loginNoPassword = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    await writeMessage(loginNoPassword, "Login");


    // Spara GIF utan username
    const saveNoUsername = await fetch("http://localhost:8000/save-gif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gifUrl }),
    });
    await writeMessage(saveNoUsername, "save-Gif");

    // Radera GIF utan username
    const deleteNonExistingUser = await fetch("http://localhost:8000/delete-gif", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "doesnotexist",
        gifUrl: "https://example.com/test.gif"
      }),
    });
    await writeMessage(deleteNonExistingUser, "delete-Gif");



  } catch (error) {
    console.error("Catch-fel:", error);
  }
}

testRun();

