import { ConfigError, ERROR_CODE, ERROR_MESSAGES } from "../errors";
import { R2AConfig } from "../types";

/**
 * Validates the configuration structure
 * @param config The configuration to validate
 * @returns {boolean} Whether the configuration is valid
 */
export function validateR2AConfig(config: unknown): config is R2AConfig {
  if (!config || typeof config !== "object") {
    throw new ConfigError(
      ERROR_MESSAGES.CONFIG.PARSE_ERROR,
      ERROR_CODE.CONFIG.PARSE_ERROR
    );
  }

  const typedConfig = config as Record<string, unknown>;
  return (
    "ios" in typedConfig &&
    (typeof typedConfig.entry === "string" ||
      typedConfig.entry === undefined) &&
    "android" in typedConfig &&
    (typeof typedConfig.output === "string" || typedConfig.output === undefined)
  );
}
