import { ConfigError, ERROR_CODE, ERROR_MESSAGES } from "../errors/index.js";
import { syncExpoProject } from "../utils/expo.js";
import { loadR2AConfig } from "../utils/r2aConfig.js";

export const sync = async () => {
  try {
    const R2AConfig = await loadR2AConfig();
    if (!R2AConfig) {
      throw new ConfigError(
        ERROR_MESSAGES.CONFIG.NOT_FOUND,
        ERROR_CODE.CONFIG.NOT_FOUND
      );
    }
    syncExpoProject(R2AConfig);
  } catch (error) {
    console.error(error);
  }
};
