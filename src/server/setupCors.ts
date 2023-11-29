import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export default function (server: FastifyInstance) {
  const allowedOrigins = server.config.CORS_ALLOWED_ORIGINS.split(",");
  server.register(cors, {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
}
