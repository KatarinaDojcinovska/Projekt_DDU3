import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { User } from "../frontend/src/classes/User.js"

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

    let maxId = 0;
       for (const u of users) {
         const id = Number(u.id);
         if (id > maxId) {
         maxId = id;
        }
       }

    const newId = maxId + 1;
    const newUser = new User(newId, body.username, body.password, []);

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