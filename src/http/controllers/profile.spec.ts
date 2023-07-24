import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { response } from "express";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to get user profile", async () => {
    await request(app.server).post("/users").send({
      name: "Test-user",
      email: "test-user@test.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "test-user@test.com",
      password: "123456",
    });

    const { token } = authResponse.body;

    const response = await request(app.server)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: "test-user@test.com",
      })
    );
  });
});
