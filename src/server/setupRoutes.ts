import { FastifyInstance } from "fastify";
import userRoutes from "../modules/user/user.route";
import recordRoutes from "../modules/record/record.route";
import { userSchemas } from "../modules/user/user.schema";
import { recordSchemas } from "../modules/record/record.schema";
import healthcheckRoute from "../routes/health.route";

export default function (server: FastifyInstance) {
  const allSchemas = [...userSchemas, ...recordSchemas];
  for (const schema of allSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: "api/users" });
  server.register(recordRoutes, { prefix: "api/records" });
  server.register(healthcheckRoute, { prefix: "api" });
}
