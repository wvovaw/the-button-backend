import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";
import { version } from "../../package.json";

export default function (server: FastifyInstance) {
  server.register(
    swagger,
    withRefResolver({
      swagger: {
        info: {
          title: "The Button clone API ",
          description: "The Button clone game API docs",
          version,
        },
        securityDefinitions: {
          apiKey: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
          },
        },
        security: [
          {
            apiKey: [],
          },
        ],
      },
    }),
  );
  server.register(swaggerUi, {
    prefix: "/docs",
    uiConfig: {
      docExpansion: "list",
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
}
