import { CheckIn } from "@prisma/client";
import { Prisma } from "@prisma/client";

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findManyByUserId(userid: string, page: number): Promise<CheckIn[]>;
  findByUserIdOnDate(userId: string, date: string): Promise<CheckIn | null>;
}
