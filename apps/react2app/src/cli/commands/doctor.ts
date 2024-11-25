import { loadR2AConfig } from "../utils/r2aConfig";
import { validateExpoProject } from "../utils/expo";
import { validateR2AConfig } from "../utils/validation";
import { ERROR_CODE } from "../errors";
import { ERROR_MESSAGES } from "../errors";
import { ConfigError } from "../errors";

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
