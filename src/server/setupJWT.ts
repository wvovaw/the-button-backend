import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";

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

export default function (server: FastifyInstance) {
  server.register(fjwt, {
    secret: server.config.JWT_SECRET,
    verify: {
      extractToken: (request) =>
        request.headers.authorization?.split(" ").at(1),
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
}
