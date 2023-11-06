import closeWithGrace from "close-with-grace";
import { FastifyInstance } from "fastify";

export default function (server: FastifyInstance) {
  const closeListeners = closeWithGrace(
    { delay: 500 },
    async (opts: Record<string, unknown>) => {
      if (opts.err) {
        server.log.error(opts.err);
      }

      await server.close();
    },
  );

  server.addHook("onClose", (_instance, done) => {
    closeListeners.uninstall();
    done();
  });
}
