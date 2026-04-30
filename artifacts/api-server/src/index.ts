import { config } from "dotenv";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app";

// Cascade: .env first, then .env.development overrides if it exists (test Wompi keys etc.)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
config({ path: path.join(root, ".env") });
const devEnv = path.join(root, ".env.development");
if (existsSync(devEnv)) {
  config({ path: devEnv, override: true });
}
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
