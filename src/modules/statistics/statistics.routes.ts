import { FastifyInstance } from "fastify";
import { getStatisticsHandler } from "./statistics.controller";
import { $ref } from "./statistics.schemas";

async function statisticsRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      schema: {
        response: {
          200: {
            ...$ref("getStatisticsResponseSchema"),
            description: "Return statistics",
          },
        },
        description: "Return game statistics",
        tags: ["Statistics"],
      },
    },
    getStatisticsHandler,
  );
}
export default statisticsRoutes;
