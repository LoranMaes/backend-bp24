const express = require("express");
const bodyParser = require("body-parser");
const api = require("./api");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api", api);

app.get("/", (req, res) => {
  res.send("Hello World, from Express!");
});

app.listen(port, () => {
  console.log(`Example Express app listening at http://localhost:${port}`);
});
