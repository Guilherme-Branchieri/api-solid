import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { z } from "zod";

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
  await prisma.user.create({
    data: {
      name: "test-user",
      email: "test-user@test.com",
      password_hash: await hash("123456", (6)),
      role: isAdmin ? 'ADMIN' : 'MEMBER'
    }})


const authResponse = await request(app.server).post("/sessions").send({
  email: "test-user@test.com",
  password: "123456",
});

const { token } = authResponse.body;

return { token };
}
