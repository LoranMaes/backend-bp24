const Router = require("koa-router");
const router = new Router({
  prefix: "/api",
});

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

router.get("/", async (ctx, next) => {
  // You could also add Controllers to handle the logic and call them here
  let response = null;
  await fetch("https://dummyjson.com/quotes")
    .then((res) => res.json())
    .then((data) => (data ? (response = data) : null));
  if (response) {
    ctx.status = 200;
    ctx.body = {
      message: "Quotes from dummyjson.com",
      data: response,
    };
    return next();
  }
  ctx.status = 500;
  ctx.body = { error: "Something went wrong" };
  return next();
});

router.get("/users", (ctx, next) => {
  const users = database.users.map((user) => {
    return { id: user.id, name: user.name, email: user.email };
  });
  if (!users) {
    ctx.status(404).json({ error: "Geen gebruikers gevonden" });
    return next();
  }
  ctx.status = 200;
  ctx.body = { message: "Gebruikers gevonden", data: users };

  return next();
});

router.post("/user", (ctx, next) => {
  if (!ctx.request.body) {
    ctx.status = 400;
    ctx.body = { error: "Naam, e-mail en password zijn vereist" };
    return next();
  }
  const { name, email, password } = ctx.request.body;

  if (!name || !email || !password) {
    ctx.status = 400;
    ctx.body = { error: "Naam, e-mail en password zijn vereist" };
    return next();
  }

  if (database.users.find((user) => user.email === email)) {
    ctx.status = 400;
    ctx.body = { error: "E-mail is al in gebruik" };
    return next();
  }

  let newUser = {
    id: database.users.length + 1,
    name,
    email,
    password,
  };
  database.users.push(newUser);

  newUser.password = undefined;
  ctx.status = 201;
  ctx.body = { message: "Gebruiker toegevoegd", data: newUser };
  return next();
});

router.post("/login", (ctx, next) => {
  if (!ctx.request.body) {
    ctx.status = 400;
    ctx.body = { error: "Gebruikersnaam en wachtwoord zijn vereist" };
    return next();
  }
  const { email, password } = ctx.request.body;
  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { error: "Gebruikersnaam en wachtwoord zijn vereist" };
    return next();
  }
  const user = database.users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    ctx.status = 200;
    ctx.body = { message: "Login succesvol", data: user };
    return next();
  }
  ctx.status = 401;
  ctx.body = { error: "Ongeldige gebruikersnaam of wachtwoord" };
  return next();
});

module.exports = router;
