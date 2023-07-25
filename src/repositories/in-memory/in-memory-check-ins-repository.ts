import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id
    );
    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn;
    }

    return checkIn;
  }
  async findById(userId: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((item) => item.id === userId);
    if (!checkIn) {
      return null;
    }

    return checkIn;
  }
  async countByUserId(userid: string): Promise<number> {
    return this.checkIns.filter((item) => item.userId === userid).length;
  }
  public checkIns: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: string) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      return checkIn.userId === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }
    return checkInOnSameDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      userId: data.userId,
      gymId: data.gymId,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findManyByUserId(userid: string, page: number): Promise<CheckIn[]> {
    return this.checkIns
      .filter((item) => item.userId === userid)
      .slice((page - 1) * 20);
  }
}
