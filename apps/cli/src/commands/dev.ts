// src/commands/dev.ts
import { CommandOptions } from "../types/index.js";
import { runDevServer } from "../utils/devServer.js";
import { logger } from "../utils/logger.js";
import { ensureReactProjectRootDir } from "../utils/path.js";
import { initializeR2AConfig } from "../utils/r2aConfig.js";
import { initializeExpoProject } from "../utils/expo.js";
import { BaseError } from "../errors/index.js";

export const dev = async (
  platform: string,
  options: CommandOptions
): Promise<void> => {
  try {
    ensureReactProjectRootDir();
    const R2AConfig = await initializeR2AConfig();
    await initializeExpoProject(R2AConfig);
    runDevServer();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
};
