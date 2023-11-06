import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export default function (server: FastifyInstance) {
  server.register(cors, {
    origin: [process.env.APP_FRONTEND_ORIGIN ?? "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
}
