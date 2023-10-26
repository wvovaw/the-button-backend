import { FastifyInstance } from "fastify";
import {
  createRecordHandler,
  getRecordByOwnerIdHandler,
  getRecordsHandler,
  updateRecordHandler,
} from "./record.controller";
import { $ref } from "./record.schema";

async function recordRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createtRecordBodySchema"),
        response: {
          201: $ref("recordResponseSchema"),
        },
      },
    },
    createRecordHandler,
  );

  server.put(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("updateRecordBodySchema"),
        response: {
          200: $ref("recordResponseSchema"),
        },
      },
    },
    updateRecordHandler,
  );

  server.get(
    "/",
    {
      schema: {
        // BUG: Show all record schemes names instead of the next scheme
        querystring: $ref("getRecordsQuerySchema"),
        response: {
          200: $ref("recordsResponseSchema"),
        },
      },
    },
    getRecordsHandler,
  );

  server.get(
    "/:ownerId",
    {
      schema: {
        // BUG: Show all record schemes names instead of the next scheme
        params: $ref("getRecordByOwnerIdParamsSchema"),
        response: {
          200: $ref("recordResponseSchema"),
        },
      },
    },
    getRecordByOwnerIdHandler,
  );
}

export default recordRoutes;
