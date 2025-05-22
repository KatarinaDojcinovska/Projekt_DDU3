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

saveButton.addEventListener("click", async function () {
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