import { FastifyInstance } from "fastify";
import cache from "../utils/node-cache";

export default function (server: FastifyInstance) {
  server.decorate("cache", cache);
}
