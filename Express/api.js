const express = require("express");
const router = express.Router();

const database = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ],
};

router.get("/", (req, res) => {
  res.send("API is working properly");
});

router.get("/users", (req, res) => {
  res.status(200).json(database.users);
});

router.post("/user", (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Naam en e-mail zijn vereist" });
  }
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Naam en e-mail zijn vereist" });
  }

  const newUser = { id: database.users.length + 1, name, email };
  database.users.push(newUser);

  setTimeout(() => {
    res.status(201).json(newUser);
  }, 200);
});

router.post("/login", (req, res) => {
  res.send("Login user");
});

module.exports = router;
