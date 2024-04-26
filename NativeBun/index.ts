const database = {
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "Azerty123",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      password: "Azerty123",
    },
  ],
};

const server = Bun.serve({
  port: 3000,
  async fetch(req: Request) {
    const { method } = req;
    const { pathname } = new URL(req.url);
    if (method === "GET" && pathname === "/api") {
      let response = null;
      await fetch("https://dummyjson.com/quotes/")
        .then((res) => res.json())
        .then((data) => (data ? (response = data) : null));
      if (response) {
        return new Response(
          JSON.stringify({
            message: "Quotes from dummyjson.com",
            data: response,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      return new Response(JSON.stringify({ message: "No data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (method === "GET" && pathname === "/api/users") {
      const users = database.users.map((user) => {
        return { id: user.id, name: user.name, email: user.email };
      });
      if (!users) {
        return new Response(JSON.stringify({ message: "No data found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({ message: "Gebruikers gevonden", data: users }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if (method === "POST" && pathname === "/api/user") {
      const data = await req.json();
      if (!data) {
        return new Response(
          JSON.stringify({ message: "Naam, e-mail en password zijn vereist" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      const { name, email, password } = data;
      if (!name || !email || !password) {
        return new Response(
          JSON.stringify({ message: "Naam, e-mail en password zijn vereist" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (database.users.find((user) => user.email === email)) {
        return new Response(
          JSON.stringify({ message: "E-mail is al in gebruik" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      let user = {
        id: database.users.length + 1,
        name,
        email,
        password,
      };
      database.users.push(user);

      user.password = undefined;
      return new Response(
        JSON.stringify({ message: "Gebruiker toegevoegd", data: user }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if (method === "POST" && pathname === "/api/login") {
      const data = await req.json();
      if (!data) {
        return new Response(
          JSON.stringify({ message: "E-mail en password zijn vereist" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      const { email, password } = data;
      if (!email || !password) {
        return new Response(
          JSON.stringify({ message: "E-mail en password zijn vereist" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const user = database.users.find(
        (user) => user.email === email && user.password === password
      );
      if (!user) {
        return new Response(
          JSON.stringify({ message: "Ongeldige e-mail of password" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "Gebruiker ingelogd", data: user }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server started at ${server.port}`);
