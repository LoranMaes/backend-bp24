import { Hono } from "hono";

const api = new Hono();

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

api.get("/", async (c) => {
  let response = null;
  await fetch("https://dummyjson.com/quotes")
    .then((res) => res.json())
    .then((data) => (data ? (response = data) : null));

  if (response) {
    return c.json(
      { message: "Quotes from dummyjson.com", data: response },
      200
    );
  }
  return c.json({ message: "No data found" }, 404);
});

api.get("/users", (c) => {
  const users = database.users.map((user) => {
    return { id: user.id, name: user.name, email: user.email };
  });
  if (!users) {
    return c.json({ message: "No users found" }, 404);
  }
  return c.json({ message: "Users found", data: users }, 200);
});

interface User {
  name: string;
  email: string;
  password: string;
}
api.post("/user", async (c) => {
  const { name, email, password } = await c.req.json<User>();

  if (!name || !email || !password) {
    return c.json({ message: "Please provide all fields" }, 400);
  }
  if (database.users.find((user) => user.email === email)) {
    return c.json({ message: "User already exists" }, 400);
  }
  let user = {
    id: database.users.length + 1,
    name,
    email,
    password,
  };
  database.users.push(user);

  const { password: _, ...return_user } = user;
  return c.json({ message: "User added", data: return_user }, 201);
});

api.post("/login", async (c) => {
  const { email, password } = await c.req.json<{
    email: string;
    password: string;
  }>();
  if (!email || !password) {
    return c.json({ message: "Please provide all fields" }, 400);
  }

  const user = database.users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return c.json({ message: "Invalid credentials" }, 400);
  }
  const { password: _, ...return_user } = user;
  return c.json({ message: "Login successful", data: return_user }, 200);
});

export default api;
