import { t } from "elysia";

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

export class ApiController {
  static async getRoot() {
    let response = null;
    await fetch("https://dummyjson.com/quotes")
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

  static async getRoot2(error: any | null) {
    let response = null;
    await fetch("https://dummyjson.com/quotes")
      .then((res) => res.json())
      .then((data) => (data ? (response = data) : null));
    if (response)
      return {
        message: "Quotes from dummyjson.com",
        data: response,
      };
    return error(404, "No data found");
  }

  static getUsers(error: any | null) {
    const users = database.users.map((user) => {
      return { id: user.id, name: user.name, email: user.email };
    });
    if (!users) {
      return error(404, "No users found");
    }
    return {
      message: "List of users",
      data: users,
    };
  }

  static createUser(
    error: any | null,
    body: { name: string; email: string; password: string }
  ) {
    if (database.users.find((user) => user.email === body.email)) {
      return error(400, "User already exists");
    }
    const newUser = {
      id: database.users.length + 1,
      name: body.name,
      email: body.email,
      password: body.password,
    };
    database.users.push(newUser);
    return {
      message: "User created",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  static loginUser(
    error: any | null,
    body: { email: string; password: string }
  ) {
    const user = database.users.find(
      (user) => user.email === body.email && user.password === body.password
    );
    if (!user) {
      return error(401, "Invalid credentials");
    }
    return {
      message: "User logged in",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
