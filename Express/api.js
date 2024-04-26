const express = require("express");
const router = express.Router();

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

router.get("/", async (req, res) => {
  let response = null;
  await fetch("https://dummyjson.com/quotes")
    .then((res) => res.json())
    .then((data) => (data ? (response = data) : null));
  if (response) {
    res.status(200).json({
      message: "Quotes from dummyjson.com",
      data: response,
    });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/users", (req, res) => {
  const users = database.users.map((user) => {
    user.password = undefined;
    return user;
  });
  if (!users) {
    return res.status(404).json({ error: "Geen gebruikers gevonden" });
  }
  res.status(200).json({ message: "Gebruikers gevonden", data: users });
});

router.post("/user", (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ error: "Naam, e-mail en password zijn vereist" });
  }
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Naam, e-mail en password zijn vereist" });
  }

  if (database.users.find((user) => user.email === email)) {
    return res.status(400).json({ error: "E-mailadres bestaat al" });
  }

  const newUser = { id: database.users.length + 1, name, email, password };
  database.users.push(newUser);

  newUser.password = undefined;
  res.status(201).json(newUser);
});

router.post("/login", (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ error: "Gebruikersnaam en wachtwoord zijn vereist" });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Gebruikersnaam en wachtwoord zijn vereist" });
  }

  const user = database.users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    return res.status(200).json({ message: "Login succesvol", data: user });
  } else {
    return res
      .status(401)
      .json({ error: "Onjuiste gebruikersnaam of wachtwoord" });
  }
});

module.exports = router;
