
function writeMessage(data){
  let mainElement = document.querySelector("main");
}


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


