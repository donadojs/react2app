export const ERROR_MESSAGES = {
  PROJECT: {
    NOT_PROJECT_ROOT:
      "This command must be run in a root directory of your React project",
    NO_REACT_PROJECT: "There is no React project in the current directory",
    NO_PACKAGE_JSON: "package.json file not found in the current directory",
  },
  CONFIG: {
    LOAD_FAILED: "Failed to load R2A config",
    CREATE_FAILED: "Failed to create R2A config",
    NOT_FOUND: "R2A config file not found",
    PARSE_ERROR: "R2A config file parse error",
    WRITE_ERROR: "R2A config file write error",
  },
  DEV_SERVER: {
    SERVER_FAILED: "Failed to start a dev server",
  },
  EXPO: {
    CREATE_FAILED: "Expo project creation failed",
    DEPS_INSTALL_FAILED: "Expo dependencies installation failed",
    SERVER_FAILED: "Expo server failed to start",
    PROJECT_NOT_FOUND: "Expo project not found",
  },
  WEB: {
    SERVER_FAILED: "Web server failed to start",
  },
} as const;

export const ERROR_CODE = {
  PROJECT: {
    NOT_PROJECT_ROOT: "NOT_PROJECT_ROOT",
    NO_REACT_PROJECT: "NO_REACT_PROJECT",
    NO_PACKAGE_JSON: "NO_PACKAGE_JSON",
  },
  CONFIG: {
    LOAD_FAILED: "CONFIG_LOAD_FAILED",
    CREATE_FAILED: "CONFIG_CREATE_FAILED",
    NOT_FOUND: "CONFIG_NOT_FOUND",
    PARSE_ERROR: "CONFIG_PARSE_ERROR",
    WRITE_ERROR: "CONFIG_WRITE_ERROR",
  },
  DEV_SERVER: {
    SERVER_FAILED: "DEV_SERVER_FAILED",
  },
  EXPO: {
    CREATE_FAILED: "EXPO_CREATE_FAILED",
    DEPS_INSTALL_FAILED: "EXPO_DEPS_INSTALL_FAILED",
    SERVER_FAILED: "EXPO_SERVER_FAILED",
    PROJECT_NOT_FOUND: "EXPO_PROJECT_NOT_FOUND",
  },
  WEB: {
    SERVER_FAILED: "WEB_SERVER_FAILED",
  },
} as const;
export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

export class BaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: string
  ) {
    super(message);
    this.code = code;
  }
}

export class ProjectError extends BaseError {
  constructor(message: string, code: string, details?: string) {
    super(message, code, details);
  }
}

export class ConfigError extends BaseError {
  constructor(message: string, code: string, details?: string) {
    super(message, code, details);
  }
}

export class DevServerError extends BaseError {
  constructor(message: string, code: string, details?: string) {
    super(message, code, details);
  }
}

export class ExpoError extends BaseError {
  constructor(message: string, code: string, details?: string) {
    super(message, code, details);
  }
}

export class WebError extends BaseError {
  constructor(message: string, code: string, details?: string) {
    super(message, code, details);
  }
}
