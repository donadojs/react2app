import { logger } from "./logger.js";
import { PATHS } from "./path.js";
import { removeN2AConfig } from "./config.js";
import fs from "fs-extra";

export const cleanupN2A = async (silent: boolean = false): Promise<void> => {
  try {
    // Remove next2app.config.js
    removeN2AConfig();
    !silent && logger.info("Removed next2app.config.js");

    // Remove next2app folder if it exists
    if (fs.existsSync(PATHS.N2A.ROOT)) {
      await fs.remove(PATHS.N2A.ROOT);
      !silent && logger.info("Removed next2app folder");
    }

    !silent && logger.success("Clean completed successfully");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error; // Re-throw to let the calling function handle it
  }
};
