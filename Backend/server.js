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