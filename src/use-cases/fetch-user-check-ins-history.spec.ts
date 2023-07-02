import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInHistoryUseCase;

describe("Fetch Check-In History Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInHistoryUseCase(checkInRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await checkInRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    await checkInRepository.create({
      gymId: "gym-02",
      userId: "user-01",
    });
    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: "gym-01" }),
      expect.objectContaining({ gymId: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gymId: `gym-${i}`,
        userId: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: "gym-21" }),
      expect.objectContaining({ gymId: "gym-22" }),
    ]);
  });
});
