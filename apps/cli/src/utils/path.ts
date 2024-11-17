import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import {
  EXPO_DIR_NAME,
  R2A_CONFIG_FILENAME,
  R2A_DIR_NAME,
  R2A_CONFIG_TEMPLATE_FILENAME,
  TEMPLATE_DIR_NAME,
} from "../constants/r2aConfig.js";
import { ERROR_CODE, ERROR_MESSAGES, ProjectError } from "../errors/index.js";

export function ensurePackageJsonExist(dir: string) {
  const packageJsonPath = path.join(dir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new ProjectError(
      ERROR_MESSAGES.PROJECT.NO_PACKAGE_JSON,
      ERROR_CODE.PROJECT.NO_PACKAGE_JSON,
      dir
    );
  }
  return dir;
}

export function ensureReactProjectRootDir() {
  const currentDir = process.cwd();
  ensurePackageJsonExist(currentDir);
  const packageJsonPath = path.join(currentDir, "package.json");

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const hasReact = !!(
      packageJson.dependencies?.react || packageJson.devDependencies?.react
    );

    if (!hasReact) {
      throw new ProjectError(
        ERROR_MESSAGES.PROJECT.NO_REACT_PROJECT,
        ERROR_CODE.PROJECT.NO_REACT_PROJECT,
        currentDir
      );
    }
    return currentDir;
  } catch (error) {
    throw new ProjectError(
      ERROR_MESSAGES.PROJECT.NO_REACT_PROJECT,
      ERROR_CODE.PROJECT.NO_REACT_PROJECT,
      currentDir
    );
  }
}

export const getPaths = () => {
  const rootDir = ensureReactProjectRootDir();
  const R2ACLIRootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.."
  );

  return {
    reactProjectRootDir: path.resolve(rootDir),
    R2ARootDir: path.resolve(rootDir, R2A_DIR_NAME),
    expoRootDir: path.resolve(rootDir, R2A_DIR_NAME, EXPO_DIR_NAME),
    iosRootDir: path.resolve(rootDir, R2A_DIR_NAME, EXPO_DIR_NAME, "ios"),
    androidRootDir: path.resolve(
      rootDir,
      R2A_DIR_NAME,
      EXPO_DIR_NAME,
      "android"
    ),
    expoEnvFilePath: path.resolve(rootDir, R2A_DIR_NAME, EXPO_DIR_NAME, ".env"),
    R2AConfigPath: path.resolve(rootDir, R2A_CONFIG_FILENAME),
    R2ACLIRootDir,
    R2AConfigTemplatePath: path.resolve(
      R2ACLIRootDir,
      TEMPLATE_DIR_NAME,
      R2A_CONFIG_TEMPLATE_FILENAME
    ),
  };
};
