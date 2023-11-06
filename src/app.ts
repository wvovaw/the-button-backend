import buildServer from "./server";

async function main() {
  try {
    const server = buildServer();
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
