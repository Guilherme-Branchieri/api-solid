import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Register Use Case", function () {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it("shoud be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "tester-gym",
      description: "simple gym to check the creation of a gym",
      phone: "",
      latitude: 0,
      longitude: 0,
    });

    expect(gym).toEqual(expect.any(Object));
    expect(gym.id).toEqual(expect.any(String));
  });

});
