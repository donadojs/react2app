import { ConfigError, ERROR_CODE, ERROR_MESSAGES } from "../errors/index.js";
import { syncN2AConfigWithExpo } from "../utils/sync.js";
import { loadN2AConfig } from "../utils/config.js";

export const sync = async () => {
  try {
    const N2AConfig = await loadN2AConfig();
    if (!N2AConfig) {
      throw new ConfigError(
        ERROR_MESSAGES.CONFIG.NOT_FOUND,
        ERROR_CODE.CONFIG.NOT_FOUND
      );
    }
    await syncN2AConfigWithExpo();
  } catch (error) {
    console.error(error);
  }
};
