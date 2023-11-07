import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const coreRecord = {
  highscore: z.number().optional(),
  peaks: z.number().array().optional(),
  clicks: z.number().optional(),
};

const createtRecordBodySchema = z.object({
  ...coreRecord,
});
export type CreateRecordInput = z.infer<typeof createtRecordBodySchema>;

const updateRecordBodySchema = z.object({
  ...coreRecord,
});
export type UpdateRecordInput = z.infer<typeof updateRecordBodySchema>;

const recordResponseSchema = z.object({
  id: z.number(),
  highscore: z.number(),
  totalResets: z.number(),
  totalClicks: z.number(),
  average: z.number(),
  owner: z.object({
    id: z.number(),
    name: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});
const recordsResponseSchema = z.object({
  data: z.array(recordResponseSchema),
  meta: z.object({
    page: z.number(),
    perPage: z.number(),
    itemsCount: z.number(),
  }),
});

const getRecordsQuerySchema = z.object({
  page: z.number().gte(0).optional(),
  perPage: z.number().gte(1).optional(),
  // TODO: add orderBy
});
export type GetRecordsInput = z.infer<typeof getRecordsQuerySchema>;

const getRecordByOwnerIdParamsSchema = z.object({
  ownerId: z.number(),
});
export type GetRecordByOwnderIdInput = z.infer<
  typeof getRecordByOwnerIdParamsSchema
>;

export const { schemas: recordSchemas, $ref } = buildJsonSchemas(
  {
    createtRecordBodySchema,
    updateRecordBodySchema,
    getRecordsQuerySchema,
    getRecordByOwnerIdParamsSchema,
    recordResponseSchema,
    recordsResponseSchema,
  },
  {
    $id: "Record",
  },
);
