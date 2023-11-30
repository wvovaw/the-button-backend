import path from "node:path";
import { FastifyInstance } from "fastify";
import { FastifyEnvOptions, fastifyEnv } from "@fastify/env";
import { FromSchema } from "json-schema-to-ts";

const schema = {
  type: "object",
  required: [
    "JWT_SECRET",
    "SIGNATURE_SECRET",
    "DATABASE_URL",
    "CORS_ALLOWED_ORIGINS",
  ],
  properties: {
    NODE_ENV: {
      type: "string",
      default: "development",
    },
    PORT: {
      type: "number",
      default: 7000,
    },
    SERVER_HOSTNAME: {
      type: "string",
      default: "0.0.0.0",
    },
    JWT_SECRET: {
      type: "string",
    },
    SIGNATURE_SECRET: {
      type: "string",
    },
    DATABASE_URL: {
      type: "string",
    },
    CORS_ALLOWED_ORIGINS: {
      type: "string",
    },
  },
} as const;

type SchemaType = FromSchema<typeof schema>;
declare module "fastify" {
  interface FastifyInstance {
    config: SchemaType;
  }
}

export default async function (server: FastifyInstance) {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const configFilePath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
  server.log.info(`Environment: ${nodeEnv}`);
  server.log.info(`Config file: ${configFilePath}`);

  const options: FastifyEnvOptions = {
    confKey: "config",
    schema,
    dotenv: {
      path: configFilePath,
      debug: nodeEnv === "development",
    },
  };

  await server.register(fastifyEnv, options);
}
