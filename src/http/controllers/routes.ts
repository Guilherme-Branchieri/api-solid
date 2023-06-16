import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);
}
