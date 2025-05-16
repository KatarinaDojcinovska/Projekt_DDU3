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
