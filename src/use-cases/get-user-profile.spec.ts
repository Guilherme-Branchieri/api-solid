import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", async function () {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });
  it("should be able to get user profile", async () => {
    const createUser = await usersRepository.create({
      name: "tester",
      email: "test_user@test.com",
      password_hash: await hash("123456", 6),
    });
    const { user } = await sut.execute({
      userId: createUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("tester");
    expect(user).toBeInstanceOf(Object);
  });

  it("should not be able to get user profile given wrong id", async () => {
    await usersRepository.create({
      name: "tester",
      email: "test1user@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: "0",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
