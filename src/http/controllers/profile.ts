import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";


export async function profile(
  request: FastifyRequest,
  reply: FastifyReply
) {


  return reply.status(201).send();
}
