const gifContainer = document.getElementById("gifContainer");

function fetchGif() {
  const apiKey = "AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8";
  const searchTerm = "sunny weather"; 
  const url = "https://tenor.googleapis.com/v2/search?q=" + searchTerm + "&key=" + apiKey + "&limit=1&random=true";

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const gifUrl = data.results[0].media_formats.tinygif.url;

      const img = document.createElement("img");
      img.src = gifUrl;
      img.alt = "GIF";
      img.style.width = "100%"; // diven har fast bredd
      img.style.height = "auto"; // höjd följer bildens naturliga förhållande

      const btn = document.createElement("button");
      btn.textContent = "Spara GIF";
      btn.addEventListener("click", function () {
        saveGif(gifUrl);
      });

      gifContainer.innerHTML = ""; // rensa innan vi lägger ny
      gifContainer.appendChild(img);
      gifContainer.appendChild(btn);

      console.log("GIF hämtad och visad");
    })
    .catch(function (error) {
      console.log("Fel vid hämtning av GIF:", error);
    });
}

function saveGif(url) {
  fetch("http://localhost:8000/save-gif", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gifUrl: url })
  })
    .then(function (res) {
      if (res.ok) {
        console.log(" GIF sparad (Status " + res.status + ")");
      } else {
        console.log(" Kunde inte spara GIF (Status " + res.status + ")");
      }
    })
    .catch(function (err) {
      console.log(" Nätverksfel vid sparning:", err);
    });
}
fetchGif();
