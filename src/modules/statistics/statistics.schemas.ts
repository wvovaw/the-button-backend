import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const statisticsCore = {
  totalClicks: z.number(),
  playersCount: z.number(),
  avgHighscore: z.number(),
};

const getStatisticsResponseSchema = z.object({
  ...statisticsCore,
});

export type Statistics = z.infer<typeof getStatisticsResponseSchema>;

export const { schemas: statisticsSchemas, $ref } = buildJsonSchemas(
  {
    getStatisticsResponseSchema,
  },
  { $id: "Statistics" },
);
