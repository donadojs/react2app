import { loadR2AConfig } from "../utils/r2aConfig.js";
import { validateExpoProject } from "../utils/expo.js";
import { validateR2AConfig } from "../utils/validation.js";
import { ConfigError, ERROR_CODE, ERROR_MESSAGES } from "../errors/index.js";

export const doctor = async () => {
  try {
    const R2AConfig = await loadR2AConfig();
    if (!R2AConfig) {
      throw new ConfigError(
        ERROR_MESSAGES.CONFIG.NOT_FOUND,
        ERROR_CODE.CONFIG.NOT_FOUND
      );
    }
    validateR2AConfig(R2AConfig);
    await validateExpoProject(R2AConfig);
    return true;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
