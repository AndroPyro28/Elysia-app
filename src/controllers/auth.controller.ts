import { Elysia, t } from "elysia";
import {
  UserSchemaWithZod,
  authSigninDto,
  authSigninDtoWithZod,
} from "../schema/auth";
import AuthService from "../services/auth.service";
import { z } from "zod";

const authController = new Elysia({ prefix: "/auth" })
  // assigning service
  .decorate({
    Service: new AuthService(),
  })
  //assigning variables
  .derive(({ headers }) => {
    const auth = headers["authorization"];
    // you can extract your jwt here
    return {
      isAuth: auth,
    };
  })
  /**
   * middleware
   *
   * local
   * global
   * scoped
   */
  .onBeforeHandle(
    { as: "local" },
    ({ body, params, query, headers, isAuth }) => {
      if (!isAuth) {
        return Response.json(
          {
            message: "Unathorized: Login required",
          },
          { status: 401 }
        );
      }
    }
  )
  .get("/", ({ Service, body, params, query, headers }) => Service.getUsers())
  .post(
    "/sign-up",
    ({ body, Service }) => {
      const parsedBody = authSigninDtoWithZod.safeParse(body);

      if (!parsedBody.success) {
        return Response.json(
          {
            errors: parsedBody.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }
      return Service.signup(parsedBody.data);
    },
    {
      body: t.Any(), // currently elysia doesn't support zod
    }
  );

export default authController;
