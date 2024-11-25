import type { R2AConfig } from "../types/index.js";
import fs from "fs-extra";
import { getPaths } from "./path.js";
import { ConfigError } from "../errors/index.js";
import { ERROR_MESSAGES } from "../errors/index.js";
import { ERROR_CODE } from "../errors/index.js";

export async function checkR2AConfigExist() {
  const { R2AConfigPath } = getPaths();
  return fs.existsSync(R2AConfigPath);
}

/**
 * Loads the React2App configuration from file
 * @returns {Promise<R2AConfig | null>} The loaded configuration or null if not found
 */
export async function loadR2AConfig(): Promise<R2AConfig | null> {
  try {
    const { R2AConfigPath } = getPaths();
    if (!fs.existsSync(R2AConfigPath)) {
      return null;
    }
    const { default: loadedConfig } = await import(R2AConfigPath);
    return loadedConfig;
  } catch (error) {
    throw new ConfigError(
      ERROR_MESSAGES.CONFIG.LOAD_FAILED,
      ERROR_CODE.CONFIG.LOAD_FAILED
    );
  }
}

export const createR2AConfig = async (): Promise<R2AConfig> => {
  try {
    const { R2AConfigTemplatePath, R2AConfigPath } = getPaths();
    await fs.ensureFileSync(R2AConfigPath);
    await fs.copyFileSync(R2AConfigTemplatePath, R2AConfigPath);
    const { default: createdConfig } = await import(R2AConfigPath);
    return createdConfig;
  } catch (error) {
    throw error;
  }
};

/**
 * Initializes the React2App configuration
 * @throws {Error} If config creation fails
 * @returns {Promise<R2AConfig>} The loaded or created configuration
 */
export async function initializeR2AConfig() {
  try {
    // Load existing config if exists
    const R2AConfig = await loadR2AConfig();
    if (R2AConfig) {
      return R2AConfig;
    }
    // Create new config if not exists
    const newConfig = await createR2AConfig();
    return newConfig;
  } catch (error) {
    throw error;
  }
}
