import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import fjwt, { JWT } from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
import recordRoutes from "./modules/record/record.route";
import { userSchemas } from "./modules/user/user.schema";
import { recordSchemas } from "./modules/record/record.schema";
import { version } from "../package.json";
import * as dotenv from "dotenv";

dotenv.config();

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate: any;
  }
}
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

function buildServer() {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const isProduction = nodeEnv === "production";
  const server = Fastify({
    logger: !isProduction,
  });
  server.log.info("Server build in %s mode", nodeEnv);

  server.register(cors, {
    origin: [process.env.APP_FRONTEND_ORIGIN ?? "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  server.register(fjwt, {
    secret: process.env.APP_JWT_SECRET ?? "changemetosecret",
    verify: {
      extractToken: (request) => request.headers.authorization,
    },
  });

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (e) {
        return reply.send(e);
      }
    },
  );

  server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });

  // Register Swagger
  server.register(
    swagger,
    withRefResolver({
      swagger: {
        info: {
          title: "The Button clone API ",
          description: "The Button clone game API docs",
          version,
        },
      },
      openapi: {
        components: {
          securitySchemes: {
            Authorization: {
              type: "http",
              scheme: "Bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    }),
  );
  server.register(swaggerUi, {
    prefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  // Register routes with schemas
  const allSchemas = [...userSchemas, ...recordSchemas];
  for (const schema of allSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: "api/users" });
  server.register(recordRoutes, { prefix: "api/records" });

  return server;
}

export default buildServer;
