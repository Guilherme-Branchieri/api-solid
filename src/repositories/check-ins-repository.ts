import { CheckIn } from "@prisma/client";
import { Prisma } from "@prisma/client";

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: string): Promise<CheckIn | null>;
}