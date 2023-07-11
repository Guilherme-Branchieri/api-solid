import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);
  });

  it("should be able to get check ins count from user metrics", async () => {
    await checkInRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    await checkInRepository.create({
      gymId: "gym-02",
      userId: "user-01",
    });
    const { checkInsCount } = await sut.execute({
      userId: "user-01",
    });
    expect(checkInsCount).toEqual(2);
  });
});
