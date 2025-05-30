import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { CreateUserClass } from "../frontend/Classes/userClass.js";

function getCORSHeaders() {
  const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    return headers;
}

function readUsers() {
  const data = Deno.readTextFileSync("data.json");
  return JSON.parse(data);
}

function writeUsers(users) {
  const json = JSON.stringify(users, null, 2);
  Deno.writeTextFileSync("data.json", json);
}

function findUser(users, username) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username || users[i].name === username) {
      return users[i];
    }
  }
  return null;
}

async function handler(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const headers = getCORSHeaders();

  if (request.method === "OPTIONS") return new Response(null, { headers });
  if (pathname === "/") return new Response(null, { headers });

  // Server frontend-filer
  if (
    request.method === "GET" &&
    !pathname.startsWith("/register") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/save-gif") &&
    !pathname.startsWith("/delete-gif") &&
    !pathname.startsWith("/get-gifs")
  ) {
    return serveDir(request, { fsRoot: "../frontend", urlRoot: "" });
  }

  // REGISTER
  if (pathname === "/register" && request.method === "POST") {
    const body = await request.json();
    let users = readUsers();

    const exists = users.some(function (u) {
      return u.username === body.username;
    });

    if (exists) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409, headers });
    }

    const maxId = users.reduce(function (max, u) {
      return Math.max(max, Number(u.id));
    }, 0);

    const newId = maxId + 1;
    const newUser = new CreateUserClass(newId, body.username, body.password, []);

    users.push({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password,
      gif: newUser.gif
    });

    writeUsers(users);
    return new Response(JSON.stringify(users), { status: 200, headers });
  }

  // LOGIN
  if (pathname === "/login" && request.method === "POST") {
    const body = await request.json();
    const users = readUsers();

    if (!body.username || !body.password) {
      return new Response(JSON.stringify({ error: "Username and password required!" }), { status: 400, headers });
    }

    const user = findUser(users, body.username);
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers });
    if (user.password !== body.password) return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401, headers });

    return new Response(JSON.stringify({ message: "Login successful" }), { status: 200, headers });
  }

  // SAVE GIF
  if (pathname === "/save-gif" && request.method === "POST") {
    const body = await request.json();
    let users = readUsers();

    const user = findUser(users, body.username);
    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404, headers });

    if (!user.gif.includes(body.gifUrl)) {
      user.gif.push(body.gifUrl);
      writeUsers(users);
    }

    return new Response(JSON.stringify({ message: "GIF saved" }), { status: 200, headers });
  }

  // DELETE GIF
  if (pathname === "/delete-gif" && request.method === "DELETE") {
    const body = await request.json();
    let users = readUsers();

    const user = findUser(users, body.username);
    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404, headers });

    user.gif = user.gif.filter(function (gif) {
      return gif !== body.gifUrl;
    });

    writeUsers(users);
    return new Response(JSON.stringify({ message: "GIF deleted" }), { status: 200, headers });
  }

  // GET GIFs
  if (pathname === "/get-gifs" && request.method === "GET") {
    const username = url.searchParams.get("username");
    const users = readUsers();

    const user = findUser(users, username);
    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404, headers });

    return new Response(JSON.stringify(user.gif), { status: 200, headers });
  }
}

console.log("Servern kör på http://localhost:8000");
Deno.serve(handler);








/*
//99% klar, länka till classen rätt
import { CreateUserClass } from "../frontend/Classes/userClass.js";

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
  //register
  if (url.pathname === "/register" && request.method === "POST") {
    let user = await request.json();

    const userExists = users.some((person) => person.name === user.name);

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

      const userData = new CreateUserClass(newId, user.name, user.password, []);

      users.push(userData);

      const jsonString = JSON.stringify(users);
      Deno.writeTextFileSync("data.json", jsonString);

      return new Response(JSON.stringify(users), {
        status: 200,
        headers: headersCORS,
      });
    } else {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
        headers: {
          ...headersCORS,
          "Content-Type": "application/json",
        },
      });
    }
  }
  //login
  if (url.pathname === "/login" && request.method === "POST") {
    const user = await request.json();

    const username = user.username;
    const password = user.password;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password required!" }),
        { status: 400, headers: headersCORS }
      );
    }

    let foundUser = users.find((u) => u.name === username);
    // for (let i = 0; i < users.length; i++) {
    //   if (users[i].name === username) {
    //     foundUser = users[i];
    //     break;
    //   }
    // }

    if (!foundUser) {
      return new Response(JSON.stringify({ error: "User does not exist" }), {
        status: 404,
        headers: headersCORS,
      });
    }

    if (foundUser.password !== password) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: headersCORS,
      });
    }

    if (foundUser) {
      return new Response(JSON.stringify({ message: "Login successful" }), {
        status: 200,
        headers: headersCORS,
      });
    }
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
        headers: headersCORS,
      });
    }

    if (!user.gif.includes(gifUrl)) {
      user.gif.push(gifUrl);
      Deno.writeTextFileSync("data.json", JSON.stringify(users, null, 2));
    }

    return new Response(JSON.stringify({ message: "GIF saved" }), {
      status: 200,
      headers: headersCORS,
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
        headers: headersCORS,
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
      headers: headersCORS,
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
        headers: headersCORS,
      });
    }

    return new Response(JSON.stringify(user.gif), {
      status: 200,
      headers: headersCORS,
    });
  }
}

console.log("Servern kör på http://localhost:8000");
Deno.serve(handler);
*/
