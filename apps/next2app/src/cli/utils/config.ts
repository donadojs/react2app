import type { N2AConfig } from "../types/index.js";
import fs from "fs-extra";
import { PATHS } from "./path.js";
import { ConfigError } from "../errors/index.js";
import { ERROR_MESSAGES } from "../errors/index.js";
import { ERROR_CODE } from "../errors/index.js";

export async function checkN2AConfigExist() {
  const configPath = PATHS.N2A.CONFIG_FILE;
  return fs.existsSync(configPath);
}

/**
 * Loads the next2app configuration from file
 * @returns {Promise<N2AConfig | null>} The loaded configuration or null if not found
 */
export async function loadN2AConfig(): Promise<N2AConfig | null> {
  try {
    const configPath = PATHS.N2A.CONFIG_FILE;
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

export const createN2AConfig = async (): Promise<N2AConfig> => {
  try {
    const templatePath = PATHS.CLI.CONFIG_TEMPLATE;
    const configPath = PATHS.N2A.CONFIG_FILE;
    await fs.ensureFileSync(configPath);
    await fs.copyFileSync(templatePath, configPath);
    const { default: createdConfig } = await import(configPath);
    return createdConfig;
  } catch (error) {
    throw error;
  }
};

/**
 * Initializes the next2app configuration
 * @throws {Error} If config creation fails
 * @returns {Promise<N2AConfig>} The loaded or created configuration
 */
export async function initializeN2AConfig() {
  try {
    // Load existing config if exists
    const N2AConfig = await loadN2AConfig();
    if (N2AConfig) {
      return N2AConfig;
    }
    // Create new config if not exists
    const newConfig = await createN2AConfig();
    return newConfig;
  } catch (error) {
    throw error;
  }
}

export function removeN2AConfig() {
  if (fs.existsSync(PATHS.N2A.CONFIG_FILE)) {
    fs.unlinkSync(PATHS.N2A.CONFIG_FILE);
  }
}
