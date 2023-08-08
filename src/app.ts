import fastify from "fastify";
import { ZodError, z } from "zod";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { userRoutes } from "./http/controllers/users/routes";
import { env } from "./env";
import { gymRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false
  },
  sign: {
    expiresIn: '10m'
  }
});

app.register(fastifyCookie,)

app.register(userRoutes);
app.register(gymRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    console.error(error.message);
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
