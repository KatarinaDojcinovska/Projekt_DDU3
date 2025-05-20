// Skickar en GIF-url till backend för att sparas i saved-gifs.json
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
      console.log("Nätverksfel vid sparning av GIF:", err);
    });
}
