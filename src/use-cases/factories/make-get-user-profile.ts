import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "../check-in";

export function makeRegisterUseCase() {
  const checkInRepostory = new InMemoryCheckInsRepository();
  const checkInUseCase = new CheckInUseCase(checkInRepostory);

  return checkInUseCase;
}
