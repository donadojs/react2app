import fs from "fs";
import path from "path";
import { PATHS } from "./path.js";
import { ERROR_CODE, ERROR_MESSAGES, ProjectError } from "../errors/index.js";

export function validatePackageJson(dir: string = PATHS.PROJECT_ROOT): void {
  const packageJsonPath = path.join(dir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new ProjectError(
      ERROR_MESSAGES.PROJECT.NO_PACKAGE_JSON,
      ERROR_CODE.PROJECT.NO_PACKAGE_JSON,
      dir
    );
  }
}

export function validateReactProject(dir: string = PATHS.PROJECT_ROOT): void {
  validatePackageJson(dir);
  const packageJsonPath = path.join(dir, "package.json");

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const hasReact = !!(
      packageJson.dependencies?.react || packageJson.devDependencies?.react
    );

    if (!hasReact) {
      throw new ProjectError(
        ERROR_MESSAGES.PROJECT.NO_REACT_PROJECT,
        ERROR_CODE.PROJECT.NO_REACT_PROJECT,
        dir
      );
    }
  } catch (error) {
    throw new ProjectError(
      ERROR_MESSAGES.PROJECT.NO_REACT_PROJECT,
      ERROR_CODE.PROJECT.NO_REACT_PROJECT,
      dir
    );
  }
}

export function validateR2AConfig(): void {
  if (!fs.existsSync(PATHS.R2A.CONFIG_FILE)) {
    throw new ProjectError(
      ERROR_MESSAGES.PROJECT.NO_R2A_CONFIG,
      ERROR_CODE.PROJECT.NO_R2A_CONFIG,
      PATHS.PROJECT_ROOT
    );
  }
}
