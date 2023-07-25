import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gym Nearby(e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);
    /*await gymsRepository.create({
        title: "Near gym",
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      });
  
      await gymsRepository.create({
        title: "Far Gym",
        description: null,
        phone: null,
        latitude: -29.1499416,
        longitude: -51.5955655,*/
    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near Test Gym",
        description: "Just testing",
        phone: "0000-000",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Far Test Gym",
        description: "Just testing, again!",
        phone: "0000-000",
        latitude: -29.1499416,
        longitude: -51.5955655,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -29.1499416,
        longitude: -51.5955655,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Near Test Gym",
      }),
    ]);
  });
});
