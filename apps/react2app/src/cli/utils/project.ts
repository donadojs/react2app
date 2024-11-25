import { ReactFramework, REACT_FRAMEWORK } from "../constants/index.js";
import path from "path";
import { readFileSync } from "fs";
import { ERROR_CODE } from "../errors/index.js";
import { ProjectError } from "../errors/index.js";
import { ERROR_MESSAGES } from "../errors/index.js";

export const determineReactFramework = (rootDir: string): ReactFramework => {
  const packageJsonPath = path.join(rootDir, "package.json");
  const packageJson = readFileSync(packageJsonPath, "utf-8");
  const packageJsonData = JSON.parse(packageJson);

  if (packageJsonData.dependencies["next"]) {
    return REACT_FRAMEWORK.NEXTJS;
  }
  if (packageJsonData.dependencies["react"]) {
    return REACT_FRAMEWORK.REACT;
  }

  throw new ProjectError(
    ERROR_MESSAGES.PROJECT.NO_REACT_PROJECT,
    ERROR_CODE.PROJECT.NO_REACT_PROJECT
  );
};
