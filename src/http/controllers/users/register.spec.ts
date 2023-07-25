import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";

describe("Register user (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "Test-user",
      email: "test-user@test.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
  });
});
