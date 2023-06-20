import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "../../src/use-cases/register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "../../src/use-cases/errors/user-already-exists";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", function () {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
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
    const { user } = await sut.execute({
      name: "test user",
      email: "test1user@example.com",
      password: "123456",
    });
    expect(user).toEqual(expect.any(Object));
    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register with same email twice", async function () {
    const name = "test user";
    const email = "tester@test.com";
    const password = "123456";

    await sut.execute({
      name,
      email,
      password,
    });

    await expect(() =>
      sut.execute({
        name,
        email,
        password,
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
