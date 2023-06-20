import { expect, describe, it, beforeEach } from "vitest";
import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { string } from "zod";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials";
import { UsersRepository } from "@/repositories/users-repository";

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe("Authenticate Use Case", async function (){
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it("should be able to authenticate", async () => {
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
    await usersRepository.create({
      name: "tester",
      email: "test1user@example.com",
      password_hash: await hash("123456", 6),
    });
    
    await expect(() =>
      sut.execute({
        email: "test1user@example.com",
        password: "13123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
