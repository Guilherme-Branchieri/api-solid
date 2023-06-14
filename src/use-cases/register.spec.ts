import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "test user",
      email: "test1user@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("shoud be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "test user",
      email: "test1user@example.com",
      password: "123456",
    });
    expect(user).toEqual(expect.any(Object))
    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const name = "test user";
    const email = "tester@test.com";
    const password = "123456";

    await registerUseCase.execute({
      name,
      email,
      password,
    });

    await expect(() =>
      registerUseCase.execute({
        name,
        email,
        password,
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
