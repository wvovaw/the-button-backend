import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
import productRoutes from "./modules/product/product.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
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

// declare module "fastify-jwt" {
//   interface FastifyJWT {
//     user: {
//       id: number;
//       email: string;
//       name: string;
//     };
//   }
// }

function buildServer() {
  const isProduction = process.env.NODE_ENV === "production";
  const server = Fastify({
    logger: !isProduction,
  });

  server.register(fjwt, {
    secret: process.env.APP_JWT_SECRET ?? "changemetosecret",
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

  server.get("/healthcheck", async function () {
    return { status: "OK" };
  });

  server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });

  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver(
      {
        openapi: {
          info: {
            title: "The Button clone API",
            description: "API for The Button clone game",
            version,
          },
        },
      },
      //   {
      //   routePrefix: "/docs",
      //   exposeRoute: true,
      //   staticCSP: true,
      //   openapi: {
      //     info: {
      //       title: "The Button clone API",
      //       description: "API for The Button clone game",
      //       version,
      //     },
      //   },
      // }
    ),
  );

  server.register(userRoutes, { prefix: "api/users" });
  server.register(productRoutes, { prefix: "api/products" });

  return server;
}

export default buildServer;
