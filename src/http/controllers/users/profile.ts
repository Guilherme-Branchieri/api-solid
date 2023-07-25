import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase();

  const user = await getUserProfile.execute({
    userId: request.user.sub,
  });

  if (!user) {
    throw new ResourceNotFoundError();
  }
  return reply.status(200).send({
    user: {
      ...user.user,
      password_hash: undefined
    },
  });
}
