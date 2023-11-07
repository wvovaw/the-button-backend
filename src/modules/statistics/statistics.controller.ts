import { type Statistics } from "./statistics.schemas";
import { getStatistics } from "./statistics.services";
import cache from "../../utils/node-cache";

export async function getStatisticsHandler(): Promise<Statistics> {
  const cachedStatistics = cache.get<Statistics>("statistics");

  if (cachedStatistics) {
    return cachedStatistics;
  } else {
    const statistics = await getStatistics();
    cache.set("statistics", statistics, 60);
    return statistics;
  }
}
