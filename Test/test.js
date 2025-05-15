const apikey = "AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8";
const searchTerm = "sunny weather";

async function fetchGif() {
    const url = `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8&limit=1&random=true`;

    try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data)
    const gifUrl = data.results[0].media_formats.tinygif.url;

    const gifContainer = document.getElementById("gifContainer");
    const img = document.createElement("img");
    img.src = gifUrl;
    img.alt = "Weather GIF";
    gifContainer.appendChild(img);
  } catch (err) {
    console.error("Misslyckades att hämta GIF:", err);
  }
}

fetchGif();

