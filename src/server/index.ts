import Fastify from "fastify";
import { PinoLoggerOptions } from "fastify/types/logger";
import setupSwagger from "./setupSwagger";
import setupCloseWithGrace from "./setupCloseWithGrace";
import setupRoutes from "./setupRoutes";
import setupJWT from "./setupJWT";
import setupCors from "./setupCors";
import setupErrorHandler from "./setupErrorHandler";
import setupEnv from "./setupEnv";

async function buildServer() {
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

  await setupEnv(server);
  setupErrorHandler(server);
  setupCors(server);
  setupJWT(server);
  setupSwagger(server);
  setupRoutes(server);
  setupCloseWithGrace(server);

  return server;
}

export default buildServer;
