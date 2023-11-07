// import { FastifyReply, FastifyRequest } from "fastify";
import { type Statistics } from "./statistics.schemas";
import { getStatistics } from "./statistics.services";

export function getStatisticsHandler(): Promise<Statistics> {
  const statistics = getStatistics();
  return statistics;
}
