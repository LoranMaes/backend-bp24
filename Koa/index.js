const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const router = require("./router");

const app = new Koa();

// You can chain the methods together, just like in Express
app
  .use(bodyParser())
  .use(router.routes())
  .listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
  });
