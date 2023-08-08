import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const newFakeGym = await prisma.gym.create({
      data: {
        title: "Tester Gym",
        description: "Just testing",
        phone: "0000-000",
        latitude: -29.160013,
        longitude: -51.1480951,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${newFakeGym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: newFakeGym.latitude,
        longitude: newFakeGym.longitude
      });

    expect(response.statusCode).toEqual(201);
  });
});
