import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authenticate } from "./controllers/authenticate";
import { profile } from "./controllers/profile";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.get("/profile", { onRequest: [verifyJWT] }, profile);
}
