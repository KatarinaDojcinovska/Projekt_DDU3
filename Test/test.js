const gifBox = document.getElementById("gif");

async function register() {
  const response = await fetch("http:localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "sun", password: "moon" }),
  });

  const data = await response.json();

  if (response.status === 200) {
    console.log("sucess", data);
  } else {
    console.log("user already exists, conflict", data);
  }
  login();
}
register();

async function login() {
  const response = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "sun", password: "moon" }),
  });

  const data = await response.json();

  if (response.status === 200) {
    console.log("success", data);
  } else if (response.status === 400) {
    console.log("username and password required", data);
  } else {
    console.log("Invalid password", data);
  }
 getGIF()
}

async function getGIF() {
  let currentGifUrl;

  const apiKey = "AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8";
  const searchTerm = "sunny weather";
  const url = `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${apiKey}&limit=1&random=true`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  currentGifUrl = data.results[0].media_formats.tinygif.url;
  gifBox.innerHTML = "";

  const img = document.createElement("img");
  img.src = currentGifUrl;
  img.style.width = "200px";
  gifBox.appendChild(img);

  console.log("GIF hämtad:", currentGifUrl);
  saveGIF();
}


async function saveGIF() {
  const response = await fetch("http://localhost:8000/save-gif", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "sun", gifUrl:"https://media.tenor.com/hdf7HJw5TL0AAAAM/weather-nw.gif"}),
  });

  const data = await response.json();

  if (response.status === 200) {
    console.log("sucess, the GIF is saved", data);
  } else {
    console.log("user not found", data);
  }
  deleteGIF()
}

async function deleteGIF(){
  const response = await fetch("http://localhost:8000/delete-gif", {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username: "sun", gifUrl: "https://media.tenor.com/hdf7HJw5TL0AAAAM/weather-nw.gif"})
  })

  const data = await response.json()

  if(response.status === 200){
    console.log("delete succeeded", data)
  } else {
    console.log("user not found", data)
  }
}

// //try hämta gif
// let currentGifUrl = null;

// async function bringGIF() {
//   const apiKey = "AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8";
//   const searchTerm = "sunny weather";
//   const url = `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${apiKey}&limit=1&random=true`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     currentGifUrl = data.results[0].media_formats.tinygif.url;
//     gifBox.innerHTML = "";

//     const img = document.createElement("img");
//     img.src = currentGifUrl;
//     img.style.width = "200px";
//     gifBox.appendChild(img);

//     console.log("GIF hämtad:", currentGifUrl);
//   } catch (err) {
//     console.error("Fel vid GIF-hämtning:", err);
//   }
// }

// tryGifBtn.addEventListener("click", bringGIF);

// //saveGIF
// saveGifButton.addEventListener("click", async function () {
//   if (!currentGifUrl) {
//     alert("Ingen GIF att spara.");
//     return;
//   }

//   messageBox.style.display = "block";

//   const gifUrl = JSON.stringify({ gifUrl: currentGifUrl });

//   try {
//     const response = await fetch("http://localhost:8000/save-gif", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: gifUrl,
//     });

//     const result = await response.json();

//     if (response.status === 200) {
//       messageText.textContent = "GIF saved!";
//     } else if (response.status === 404) {
//       messageText.textContent = "User not found";
//     } else {
//       messageText.textContent = result.error;
//     }
//   } catch (err) {
//     messageText.textContent = "Ett fel uppstod vid sparande.";
//     console.error(err);
//   }
// });

// closeMessageBtn.addEventListener("click", function () {
//   messageBox.style.display = "none";
// });

// //delete
// deleteGifButton.addEventListener("click", async function () {
//   const response = await fetch("http:localhost:8000/delete-gif", {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//   });

//   messageBox.style.display = "block";

//   const result = await response.json();

//   if (response.status === 200) {
//     messageText.textContent = "GIF Deleted";
//   } else if (response.status === 404) {
//     messageText.textContent = "User not found";
//   } else {
//     messageText.textContent = result.error;
//   }
// });
