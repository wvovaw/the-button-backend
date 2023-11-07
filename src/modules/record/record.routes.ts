import { FastifyInstance } from "fastify";
import {
  createRecordHandler,
  deleteRecordHandler,
  getRecordByOwnerIdHandler,
  getRecordsHandler,
  updateRecordHandler,
} from "./record.controllers";
import { $ref } from "./record.schemas";

async function recordRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: {
          ...$ref("createtRecordBodySchema"),
          description: `All properties is optional, but at least one shall be provided.
            |
            **highscore** - the maximum value reached. Resets the **highscore** field in the DB.
            **peaks** - the list of values that was reached before counter reset to 0. It recalculates **average** field in the DB.
            **clicks** - amount of clicks. **totalClicks** field increments by it.
            |
            Concider every property separatelly, not related to each other. You want to update the highscore - send highscore.
            Want to update average - send peaks. You can combine them in one request - it depends on the frontend logic.`,
        },
        response: {
          201: {
            ...$ref("recordResponseSchema"),
            description: "Successfully created new record",
          },
          409: {
            description:
              "Can not create new record. Record with the user id already exists",
            type: "object",
            properties: {
              statusCode: { type: "number", default: 409 },
              error: { type: "string", default: "Conflict" },
              message: { type: "string" },
            },
          },
          400: {
            description: "No authorization token provided",
            type: "object",
            properties: {
              statusCode: { type: "number", default: 400 },
              error: { type: "string", default: "Bad request" },
              code: { type: "string", default: "FST_JWT_BAD_REQUEST" },
              message: { type: "string" },
            },
          },
        },
        description: "Creates new record and returns it",
        tags: ["Record"],
      },
    },
    createRecordHandler,
  );

  server.put(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: {
          ...$ref("updateRecordBodySchema"),
          description: `All properties is optional, but at least one shall be provided.
            |
            **highscore** - the maximum value reached. Resets the **highscore** field in the DB.
            **peaks** - the list of values that was reached before counter reset to 0. It recalculates **average** field in the DB.
            **clicks** - amount of clicks. **totalClicks** field increments by it.
            |
            Concider every property separatelly, not related to each other. You want to update the highscore - send highscore.
            Want to update average - send peaks. You can combine them in one request - it depends on the frontend logic.`,
        },
        response: {
          201: {
            ...$ref("recordResponseSchema"),
            description: "Successfully created new record",
          },
          409: {
            description: "Record not found and can't be updated",
            type: "object",
            properties: {
              statusCode: { type: "number", default: 409 },
              error: { type: "string", default: "Conflict" },
              message: { type: "string" },
            },
          },
          400: {
            description: "No authorization token provided",
            type: "object",
            properties: {
              statusCode: { type: "number", default: 400 },
              error: { type: "string", default: "Bad request" },
              code: { type: "string", default: "FST_JWT_BAD_REQUEST" },
              message: { type: "string" },
            },
          },
        },
        description: "Updates record and returns it updated",
        tags: ["Record"],
      },
    },
    updateRecordHandler,
  );

  server.delete(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        response: {
          204: {
            description: "Successfully deleted user's record",
            type: "null",
          },
          404: {
            description: "Record not found and can't be deleted",
            type: "object",
            properties: {
              statusCode: { type: "number", default: 404 },
              error: { type: "string", default: "Not Found" },
              message: { type: "string" },
            },
          },
          400: {
            description: "No authorization token provided",
            type: "object",
            properties: {
              statusCode: { type: "number", default: 400 },
              error: { type: "string", default: "Bad request" },
              code: { type: "string", default: "FST_JWT_BAD_REQUEST" },
              message: { type: "string" },
            },
          },
        },
        description: "Deletes record",
        tags: ["Record"],
      },
    },
    deleteRecordHandler,
  );

  server.get(
    "/",
    {
      schema: {
        // BUG: using schema from $ref cause wrong params display
        querystring: {
          // ...$ref("getRecordsQuerySchema"),
          type: "object",
          required: ["page"],
          properties: {
            page: {
              type: "number",
              description: "Page number",
            },
            perPage: {
              type: "number",
              default: 20,
              description: "Items per page limit",
            },
          },
          description: "Pagination data",
        },
        response: {
          200: {
            ...$ref("recordsResponseSchema"),
            description: "Returns array of records and pagination data",
          },
        },
        description: "Get all records (paginated)",
        tags: ["Record"],
      },
    },
    getRecordsHandler,
  );

  server.get(
    "/:ownerId",
    {
      schema: {
        // BUG: using schema from $ref cause wrong params display
        params: {
          // ...$ref("getRecordByOwnerIdParamsSchema"),
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "User id",
            },
          },
          description: "Returns record by owner id",
        },
        response: {
          200: {
            ...$ref("recordResponseSchema"),
            description: "Returns users record",
          },
        },
        description: "Get a record by owner id",
        tags: ["Record"],
      },
    },
    getRecordByOwnerIdHandler,
  );
}

export default recordRoutes;
