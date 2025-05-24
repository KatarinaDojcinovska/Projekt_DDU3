//Korrekta test

const url1 = "http://0.0.0.0:8000/register";
const url2 = "http://0.0.0.0:8000/login";
const url3 = "http://0.0.0.0:8000/save-gif";
const url4 = "http://0.0.0.0:8000/delete-gif";
const url5 = "http://0.0.0.0:8000/get-gifs";

//Funktion som skapar en nytt lösenord och user för när man kör test?

const request1 = new Request(url1, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username: "hej1", password: "1234"})
});

fetch(request1)
  .then(response => {
    console.log(response.status);
    return response.json(); 
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });


const request2 = new Request(url2, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username: "hej", password: "hund"})
})

fetch(request2)
  .then(response => {
    console.log(response.status);
    return response.json(); 
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });


//Felaktiga test (ger felmeddelande)