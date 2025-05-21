const gifBox = document.getElementById("gif");
const tryGifBtn = document.querySelector(".try-Gif button");
const messageBox = document.getElementById("messageBox");
const closeMessageBtn = document.getElementById("closeMessageBtn");

let currentGifUrl = "";

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

// Event listeners
tryGifBtn.addEventListener("click", bringGIF);
closeMessageBtn.addEventListener("click", function () {
  messageBox.style.display = "none";
});

