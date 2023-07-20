import closeWithGrace from "close-with-grace";
import buildServer from "./server";

const server = buildServer();

const closeListeners = closeWithGrace(
  { delay: 500 },
  async (opts: Record<string, unknown>) => {
    if (opts.err) {
      server.log.error(opts.err);
    }

    await server.close();
  },
);

server.addHook("onClose", async (_instance, done) => {
  closeListeners.uninstall();
  done();
});

async function main() {
  try {
    void server.listen({
      port: Number(process.env.PORT ?? 3000),
      host: process.env.SERVER_HOSTNAME ?? "0.0.0.0",
    });

    server.ready((err: Error) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }

      server.log.info(
        `Server listening on port ${Number(process.env.PORT ?? 3000)}`,
      );
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
