import { FastifyInstance } from "fastify";
import {
  loginHandler,
  registerUserHandler,
  getUsersHandler,
} from "./user.controllers";
import { $ref } from "./user.schemas";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: {
            ...$ref("createUserResponseSchema"),
            description: "User created successfully",
          },
          409: {
            description: "Invalid user credentials provided",
            type: "object",
            properties: {
              statusCode: { type: "number", default: 409 },
              error: { type: "string", default: "Conflict" },
              message: { type: "string" },
            },
          },
        },
        description: "Creates new user",
        tags: ["User"],
      },
    },
    registerUserHandler,
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          200: {
            ...$ref("loginResponseSchema"),
            description: "Successfully authorized",
          },
          401: {
            description: "Invalid user credentials provided",
            type: "object",
            properties: {
              statusCode: { type: "number", default: 401 },
              error: { type: "string", default: "Unauthorized" },
              message: { type: "string" },
            },
          },
        },
        description: "Returns authorization token",
        tags: ["User"],
      },
    },
    loginHandler,
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        response: {
          200: {
            ...$ref("getUsersResponseSchema"),
            description: "Returns array of users",
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
        description: "Returns array of users",
        tags: ["User"],
      },
    },
    getUsersHandler,
  );
}

export default userRoutes;
