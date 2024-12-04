import { CommandOptions } from "../types/index.js";
import { logger } from "../utils/logger.js";
import { cleanupN2A as cleanUpN2A } from "../utils/cleanUp.js";

export const clean = async (options: CommandOptions): Promise<void> => {
  try {
    await cleanUpN2A();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
};
