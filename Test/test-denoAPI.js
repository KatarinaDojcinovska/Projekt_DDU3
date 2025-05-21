const button2 = document.getElementById("logInButton");

button2.addEventListener("click", async function () {
  const username = document.getElementById("username-logIn").value;
  const password = document.getElementById("password-logIn").value;

  const url = `http://localhost:8000/login?username=${username}&password=${password}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }); 

    console.log("hej");

    const result = await response.json();

    if (response.ok) {
      console.log("Inloggning lyckades:", result);
    } else {
      console.error("Inloggning misslyckades:", result.error);
    }
  } catch (err) {
    console.error("Något gick fel:", err);
  }
});

const saveButton = document.getElementById("saveGif")

saveButton.addEventListener("click", async function () {
  const messageBox = document.getElementById("messageBox");
  const messageText = document.getElementById("messageText");
  messageBox.style.display = "block";

  const response = await fetch("http:localhost:8000/save-gif", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
  })
  
  const result = response.json();

  if(response.status === 200){
    messageText.textContent = "GIF saved!";
  } else if(response.status === 404){
    messageText.textContent = "User not found";
  } else {
    messageText.textContent = result.error;
  }
})
