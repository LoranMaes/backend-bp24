const express = require("express");
const bodyParser = require("body-parser");
const api = require("./api");

const app = express();
const port = 3000;

// Middleware om JSON in request body te parsen
app.use(bodyParser.json());

// Middleware om API routes te groeperen onder /api
app.use("/api", api);

app.get("/", (req, res) => {
  res.send("Hello World, from Express!");
});

app.listen(port, () => {
  console.log(`Example Express app listening at http://localhost:${port}`);
});
