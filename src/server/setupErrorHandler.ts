import { FastifyInstance } from "fastify";

export default function (server: FastifyInstance) {
  server.setErrorHandler((err, req, reply) => {
    if (err.cause) reply.code(Number(err.cause)).send(err);
    else reply.send(err);
  });
}
