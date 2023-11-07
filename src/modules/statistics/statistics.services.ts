import { type Statistics } from "./statistics.schemas";
import prisma from "../../utils/prisma";

export async function getStatistics(): Promise<Statistics> {
  const stats = await prisma.record.aggregate({
    _sum: {
      totalClicks: true,
    },
    _avg: {
      highscore: true,
    },
    _count: {
      ownerId: true,
    },
  });

  const avgHighscore = stats._avg.highscore ?? 0;
  const playersCount = stats._count.ownerId;
  const totalClicks = stats._sum.totalClicks ?? 0;

  return {
    avgHighscore,
    playersCount,
    totalClicks,
  };
}
