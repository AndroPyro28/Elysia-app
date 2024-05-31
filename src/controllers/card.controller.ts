import { Elysia, t } from "elysia";
import crypto from "crypto";
const algorithm = "aes-256-cbc"; // Algorithm for encryption
const secretKey = crypto.randomBytes(32); // Securely generate a secret key
const iv = crypto.randomBytes(16);
const cardController = new Elysia({ prefix: "/card" })
  // assigning service
  //   .decorate({
  //     Service: new AuthService(),
  //   })
  //assigning variables
  //   .derive(({ headers }) => {
  //     const auth = headers["authorization"];
  //     // you can extract your jwt here
  //     return {
  //       isAuth: auth,
  //     };
  //   })
  /**
   * middleware
   *
   * local
   * global
   * scoped
   */
  .get("/", ({ body, params, query, headers }) => {
    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(query.iv!, "hex")
    );
    let decrypted = decipher.update(query.encryptedData!, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return {card: decrypted};
  })
  .post(
    "/",
    ({ body }) => {
      const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
      let encrypted = cipher.update(body.card, "utf8", "hex");
      encrypted += cipher.final("hex");
      return {
        iv: iv.toString("hex"),
        encryptedData: encrypted,
      };
    },
    {
      body: t.Object({ card: t.String() }), // currently elysia doesn't support zod,
      query: t.Object({
        iv: t.Optional(t.String()),
        encryptedData: t.Optional(t.String()),
      }),
    }
  );

export default cardController;
