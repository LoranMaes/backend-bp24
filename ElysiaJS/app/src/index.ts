import { Elysia, t } from "elysia";
import { ApiController } from "./controllers/apiController";

// / en /v1 zijn dezelfde maar v1 maakt gebruik van Elysia zelf en / maakt gebruik van het Response object.
// https://elysiajs.com/essential/handler.html#response

const elysia_app = new Elysia()
  .group("/api", (app) =>
    app
      .get("/", () => ApiController.getRoot())
      .get("/v1", ({ error }) => ApiController.getRoot2(error))
      .get("/users", ({ error }) => ApiController.getUsers(error))
      .guard(
        {
          body: t.Object({
            name: t.String(),
            email: t.RegExp(
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
            password: t.String(),
          }),
        },
        (app) =>
          app.post("/user", ({ error, body }) =>
            ApiController.createUser(error, body)
          )
      )
      .guard(
        { body: t.Object({ email: t.String(), password: t.String() }) },
        (app) =>
          app.post("/login", ({ error, body }) =>
            ApiController.loginUser(error, body)
          )
      )
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${elysia_app.server?.hostname}:${elysia_app.server?.port}`
);
