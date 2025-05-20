//Katties
async function handler(request) {
  const data = Deno.readTextFileSync("data.json");
  console.log(data)
  let users = JSON.parse(data);
  console.log(users)
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
      (person) => person.username === user.username
    );

    if (!userExists) {
      let maxId = 0;
      let idNumber;

      for (let user of users) {
        idNumber = Number(user.id);
        if (idNumber > maxId) {
          maxId = user.id;
        }
      }

      const newId = maxId + 1;

      const userData = {
        id: newId,
        username: user.username,
        password: user.password,
      };

      users.push(userData);

      const jsonString = JSON.stringify(users)
      Deno.writeTextFileSync("data.json", jsonString)

      return new Response(JSON.stringify(users), {
        status: 200,
        headers: headersCORS,
      });
    } else {
      return new Response(
        { message: "User already exists" },
        {
          status: 409,
          headers: headersCORS,
        }
      );
    }
  }
}
Deno.serve(handler);
//Judys
if (url.pathname === "/login" && request.method === "GET") {
    let userName = url.searchParams.get("username");
    let password = url.searchParams.get("password");
    
    if (!userName || !password) {
    return new Response (
        JSON.stringify({ error: "Username and password required!"}),
        {status: 400, headers: headersCORS}
    );}

    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === userName) {
            foundUser = users[i];
            break;
        }
    }

    if (!foundUser) {
        return new Response (
            JSON.stringify({ error: "User does not exist" }),
            { status: 404, headers: headersCORS }
        );
    }

    if (foundUser.password !== password) {
        return new Response (
            JSON.stringify({ error: "Invalid password" }),
            { status: 401, headers: headersCORS }
        );
    }

    return new Response (
        JSON.stringify({ message: "Login successful" }),
        { status: 200, headers: headersCORS }
    );
}
//Leiths
if (url.pathname === "/save-gif" && request.method === "POST") {
  const body = await request.json();
  const gifUrl = body.gifUrl;

  let saved = [];

  try {
    saved = JSON.parse(Deno.readTextFileSync("saved-gifs.json"));
  }catch (error) {
  console.log("Fel vid läsning av saved-gifs.json:", error.message);
  saved = [];
  }

  saved.push(gifUrl);
  console.log("GIF sparad:", gifUrl);
  Deno.writeTextFileSync("saved-gifs.json", JSON.stringify(saved, null, 2));

  return new Response(JSON.stringify({ message: "GIF sparad" }), {
    status: 200,
    headers: headersCORS,
  });
}