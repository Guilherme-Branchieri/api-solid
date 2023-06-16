import { expect, describe, it } from "vitest";
import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { string } from "zod";
import { InvalidCredentialsError } from "./errors/invalid-credentials";

describe("Authenticate Use Case", () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "tester",
      email: "test1user@example.com",
      password_hash: await hash("123456", 6),
    });
    const { user } = await sut.execute({
      email: "test1user@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate given wrong credentials", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(() =>
      sut.execute({
        email: "test1user@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
