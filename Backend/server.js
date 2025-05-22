//Katties
import { CreateUser } from "./user.js";

async function handler(request) {
  const data = Deno.readTextFileSync("data.json");
  console.log(data);
  let users = JSON.parse(data);
  console.log(users);
  const url = new URL(request.url);

  const headersCORS = new Headers();
  headersCORS.set("Access-Control-Allow-Origin", "*");
  headersCORS.set("Access-Control-Allow-Headers", "*");
  headersCORS.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  headersCORS.set("Content-Type", "application/json");

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: headersCORS });
  }

  if (url.pathname === "/") {
    return new Response(null, { headers: headersCORS });
  }

  if (url.pathname === "/register" && request.method === "POST") {
    let user = await request.json();

    const userExists = users.some(
      (person) => person.name === user.name
    );

    if (!userExists) {
      let maxId = 0;
      let idNumber;

      for (let user of users) {
        idNumber = Number(user.id);
        if (idNumber > maxId) {
          maxId = idNumber;
        }
      }

      const newId = maxId + 1;

      const userData = new CreateUser(
        newId,
        user.name,
        user.password,
        []
      );

      users.push(userData);

      const jsonString = JSON.stringify(users);
      Deno.writeTextFileSync("data.json", jsonString);

      return new Response(JSON.stringify(users), {
        status: 200,
        headers: headersCORS,
      });
    } else {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        {
          status: 409,
          headers: {
            ...headersCORS,
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  if (url.pathname === "/login" && request.method === "POST") {
    const user = await request.json();
    

    const userName = user.userName;
    const password = user.password;
  

    if (!userName || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password required!" }),
        { status: 400, headers: headersCORS }
      );
    }
 
    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i].name === userName) {
        foundUser = users[i];
        break;
      }
    }

    if (!foundUser) {
      return new Response(
        JSON.stringify({ error: "User does not exist" }),
        { status: 404, headers: headersCORS }
      );
    }
  

    if (foundUser.password !== password) {
      return new Response(
        JSON.stringify({ error: "Invalid password" }),
        { status: 401, headers: headersCORS }
      );
    }
  
    return new Response(
      JSON.stringify({ message: "Login successful" }),
      { status: 200, headers: headersCORS }
    );
  }

  // Save GIF
  if (url.pathname === "/save-gif" && request.method === "POST") {
    const body = await request.json();
    const gifUrl = body.gifUrl;
    const username = body.username;

    const data = Deno.readTextFileSync("data.json");
    const users = JSON.parse(data);

    let user = null;
    for (const u of users) {
      if (u.name === username) {
        user = u;
        break;
      }
    }

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: headersCORS
      });
    }

    if (!user.gif.includes(gifUrl)) {
      user.gif.push(gifUrl);
      Deno.writeTextFileSync("data.json", JSON.stringify(users, null, 2));
    }

    return new Response(JSON.stringify({ message: "GIF saved" }), {
      status: 200,
      headers: headersCORS
    });
  }

  // Delete GIF
  if (url.pathname === "/delete-gif" && request.method === "DELETE") {
    const body = await request.json();
    const gifUrl = body.gifUrl;
    const username = body.username;

    const data = Deno.readTextFileSync("data.json");
    const users = JSON.parse(data);

    let user = null;
    for (const u of users) {
      if (u.name === username) {
        user = u;
        break;
      }
    }

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: headersCORS
      });
    }

    const filteredGifs = [];
    for (const gif of user.gif) {
      if (gif !== gifUrl) {
        filteredGifs.push(gif);
      }
    }

    user.gif = filteredGifs;
    Deno.writeTextFileSync("data.json", JSON.stringify(users, null, 2));

    return new Response(JSON.stringify({ message: "GIF deleted" }), {
      status: 200,
      headers: headersCORS
    });
  }

  // Get GIFs
  if (url.pathname === "/get-gifs" && request.method === "GET") {
    const username = url.searchParams.get("username");

    const data = Deno.readTextFileSync("data.json");
    const users = JSON.parse(data);

    let user = null;
    for (const u of users) {
      if (u.name === username) {
        user = u;
        break;
      }
    }

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: headersCORS
      });
    }

    return new Response(JSON.stringify(user.gif), {
      status: 200,
      headers: headersCORS
    });
  }
}

console.log("Servern kör på http://localhost:8000");
Deno.serve(handler);
