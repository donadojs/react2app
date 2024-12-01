import { ConfigError, ERROR_CODE, ERROR_MESSAGES } from "../errors/index.js";
import { syncR2AConfigWithExpo } from "../utils/sync.js";
import { loadR2AConfig } from "../utils/config.js";

export const sync = async () => {
  try {
    const R2AConfig = await loadR2AConfig();
    if (!R2AConfig) {
      throw new ConfigError(
        ERROR_MESSAGES.CONFIG.NOT_FOUND,
        ERROR_CODE.CONFIG.NOT_FOUND
      );
    }
    await syncR2AConfigWithExpo();
  } catch (error) {
    console.error(error);
  }
};
