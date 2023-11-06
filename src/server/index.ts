import Fastify from "fastify";
import { PinoLoggerOptions } from "fastify/types/logger";
import * as dotenv from "dotenv";
import setupSwagger from "./setupSwagger";
import setupCloseWithGrace from "./setupCloseWithGrace";
import setupRoutes from "./setupRoutes";
import setupJWT from "./setupJWT";
import setupCors from "./setupCors";
import setupErrorHandler from "./setupErrorHandler";

dotenv.config();

function buildServer() {
  const loggerConfig: Record<string, PinoLoggerOptions | boolean> = {
    development: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
    production: true,
    test: false,
  };
  const nodeEnv = process.env.NODE_ENV ?? "development";

  const server = Fastify({
    logger: loggerConfig[nodeEnv] ?? true,
  });
  server.log.info("Server build in %s mode", nodeEnv);

  setupErrorHandler(server);
  setupCors(server);
  setupJWT(server);
  setupSwagger(server);
  setupRoutes(server);
  setupCloseWithGrace(server);

  return server;
}

export default buildServer;
