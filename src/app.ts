import fastify from "fastify";
import { ZodError, z } from "zod";
import { prisma } from "./lib/prisma";
import { appRoutes } from "./http/controllers/routes";
import { env } from "./env";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.format() });
  }

  if (env.NODE_ENV === "production") {
    console.log(error);
  } else {
    // TODO: Log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal Server Error" });
});
