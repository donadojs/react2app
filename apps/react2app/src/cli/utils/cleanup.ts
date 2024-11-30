import { logger } from "./logger.js";
import { getPaths } from "./path.js";
import { removeR2AConfig } from "./r2aConfig.js";
import fs from "fs-extra";

export const cleanupR2A = async (silent: boolean = false): Promise<void> => {
  try {
    const { R2ARootDir } = getPaths();

    // Remove react2app.config.js
    removeR2AConfig();
    !silent && logger.info("Removed react2app.config.js");

    // Remove react2app folder if it exists
    if (fs.existsSync(R2ARootDir)) {
      await fs.remove(R2ARootDir);
      !silent && logger.info("Removed react2app folder");
    }

    !silent && logger.success("Clean completed successfully");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error; // Re-throw to let the calling function handle it
  }
};
