import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { FetchUserCheckInHistoryUseCase } from "../fetch-user-check-ins-history";

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInHistoryUseCase(
    checkInsRepository
  );
  return fetchUserCheckInsHistoryUseCase;
}
