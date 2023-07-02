import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { Decimal } from "@prisma/client/runtime/library";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { MaxNumberOfCheckinsError } from "./errors/max-number-of-checkins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);
    await gymsRepository.create({
      id: "gym-01",
      title: "a normal gym",
      description: "",
      phone: "",
      latitude: new Decimal(-29.160013),
      longitude: new Decimal(-51.1480951),
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
    ).rejects.toBeInstanceOf(MaxNumberOfCheckinsError);
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

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.gyms.push({
      id: "gym-02",
      title: "a normal gym",
      description: "",
      phone: "",
      latitude: new Decimal(-29.1583853),
      longitude: new Decimal(-51.1552844),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -29.1593508,
        userLongitude: -51.1523524,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
