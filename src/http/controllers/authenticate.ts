import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string(),
    password: z.string().min(6),
  });

  const { email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
