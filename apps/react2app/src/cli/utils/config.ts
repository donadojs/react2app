import type { R2AConfig } from "../types/index.js";
import fs from "fs-extra";
import { PATHS } from "./path.js";
import { ConfigError } from "../errors/index.js";
import { ERROR_MESSAGES } from "../errors/index.js";
import { ERROR_CODE } from "../errors/index.js";

export async function checkR2AConfigExist() {
  const configPath = PATHS.R2A.CONFIG_FILE;
  return fs.existsSync(configPath);
}

/**
 * Loads the React2App configuration from file
 * @returns {Promise<R2AConfig | null>} The loaded configuration or null if not found
 */
export async function loadR2AConfig(): Promise<R2AConfig | null> {
  try {
    const configPath = PATHS.R2A.CONFIG_FILE;
    if (!fs.existsSync(configPath)) {
      return null;
    }
    const { default: loadedConfig } = await import(configPath);
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
    const templatePath = PATHS.CLI.CONFIG_TEMPLATE;
    const configPath = PATHS.R2A.CONFIG_FILE;
    await fs.ensureFileSync(configPath);
    await fs.copyFileSync(templatePath, configPath);
    const { default: createdConfig } = await import(configPath);
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

export function removeR2AConfig() {
  if (fs.existsSync(PATHS.R2A.CONFIG_FILE)) {
    fs.unlinkSync(PATHS.R2A.CONFIG_FILE);
  }
}
