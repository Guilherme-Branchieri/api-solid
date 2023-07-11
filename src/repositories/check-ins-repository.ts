import { CheckIn } from "@prisma/client";
import { Prisma } from "@prisma/client";

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  save(checkIn: CheckIn): Promise<CheckIn>;
  findManyByUserId(userid: string, page: number): Promise<CheckIn[]>;
  findByUserIdOnDate(userId: string, date: string): Promise<CheckIn | null>;
  findById(userId: string): Promise<CheckIn | null>;
  countByUserId(userid: string): Promise<number>;
}
