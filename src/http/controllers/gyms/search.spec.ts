import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to search for specific gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym Tester",
        description: "Just testing",
        phone: "0000-000",
        latitude: -29.160013,
        longitude: -51.1480951,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tester Gym",
        description: "Just testing, again!",
        phone: "0000-000",
        latitude: -29.160013,
        longitude: -51.1480951,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "Gym Tester",
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Gym Tester",
      }),
    ]);
  });
});
