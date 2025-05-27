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
  pElement.textContent = `${prefix} | Status: ${response.status} | Message: ${data.message}`;
  targetElement.appendChild(pElement);
}

const gifBox = document.getElementById("gif");

async function testRun() {
  const username = "sunny";
  const password = "moon";
  let gifUrl;

  try {
    const registerResponse = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    await writeMessage(registerResponse, "register");

    //Förväntat felmeddelande

    const registerResponse2 = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    await writeMessage(registerResponse2, "register");



    const loginResponse = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    await writeMessage(loginResponse, "Login");


    //Förväntat felmeddelande


    const username2 = "cloudy";

    const loginResponse2 = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username2, password }),
    });
    await writeMessage(loginResponse2, "Login");

    


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

    const saveResponse = await fetch("http://localhost:8000/save-gif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, gifUrl }),
    });
    await writeMessage(saveResponse, "save-Gif");

    const deleteResponse = await fetch("http://localhost:8000/delete-gif", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, gifUrl }),
    });
    await writeMessage(deleteResponse, "delete-Gif");

  } catch (error) {
    console.error("Catch-fel:", error);
  }
}

testRun();

