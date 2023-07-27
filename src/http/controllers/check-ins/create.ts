import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  });
  const createCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInsParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(
    request.body
  );

  const createCheckInsUseCase = makeCheckInUseCase();

  await createCheckInsUseCase.execute({
    gymId: gymId,
    userLatitude: latitude,
    userLongitude: longitude,
    userId: request.user.sub,
  });

  return reply.status(201).send();
}
