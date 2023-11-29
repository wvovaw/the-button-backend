import buildServer from "./server";

async function main() {
  try {
    const server = await buildServer();
    void server.listen({
      port: server.config.PORT,
      host: server.config.SERVER_HOSTNAME,
    });

    server.ready((err: Error) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(
        `Server listening on port ${server.config.SERVER_HOSTNAME}:${server.config.PORT}`,
      );
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
