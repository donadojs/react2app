// src/commands/dev.ts
import { CommandOptions } from "../types/index.js";
import { runDevServer } from "../utils/devServer.js";
import { logger } from "../utils/logger.js";
import { ensureReactProjectRootDir } from "../utils/path.js";
import { loadR2AConfig } from "../utils/r2aConfig.js";
import { syncExpoProject } from "../utils/expo.js";
import { init } from "./init.js";
import { doctor } from "./doctor.js";
import { addAppLayout } from "../utils/ux.js";

export const dev = async (
  platform: string,
  options: CommandOptions
): Promise<void> => {
  try {
    ensureReactProjectRootDir();
    const R2AConfig = await loadR2AConfig();

    const isFirstExecution = !R2AConfig;

    if (isFirstExecution) {
      await init();
      await addAppLayout();
    } else {
      await doctor();
      await syncExpoProject(R2AConfig);
    }
    runDevServer();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
};
