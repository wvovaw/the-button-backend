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
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
