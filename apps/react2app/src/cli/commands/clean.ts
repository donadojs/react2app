import { CommandOptions } from "../types/index.js";
import { logger } from "../utils/logger.js";
import { cleanupR2A } from "../utils/cleanup.js";

export const clean = async (options: CommandOptions): Promise<void> => {
  try {
    await cleanupR2A();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
};
