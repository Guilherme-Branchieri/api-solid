import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { Decimal } from "@prisma/client/runtime";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository);
    gymsRepository.gyms.push({
      id: "gym-01",
      title: "a normal gym",
      description: "",
      phone: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to CheckIn", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -29.160013,
      userLongitude: -51.1480951,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be possible to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -29.160013,
      userLongitude: -51.1480951,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -29.160013,
        userLongitude: -51.1480951,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice in the different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -29.160013,
      userLongitude: -51.1480951,
    });

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -29.160013,
      userLongitude: -51.1480951,
    });

    expect(checkIn.userId).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    return 
  })
});
