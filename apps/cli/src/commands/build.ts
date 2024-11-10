import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { logger } from "../utils/logger.js";

export const build = async () => {
  try {
    logger.info("Starting production build...");

    // Get the current working directory
    const cwd = process.cwd();

    // Check if package.json exists
    if (!fs.existsSync(path.join(cwd, "package.json"))) {
      logger.error(
        "No package.json found. Please run this command in your project root directory."
      );
      process.exit(1);
    }

    // Check if it's a React project by looking for react dependency
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(cwd, "package.json"), "utf-8")
    );
    if (!packageJson.dependencies?.react) {
      logger.error(
        "This does not appear to be a React project. No react dependency found in package.json"
      );
      process.exit(1);
    }

    // Execute build command based on package manager
    const hasYarnLock = fs.existsSync(path.join(cwd, "yarn.lock"));
    const hasPnpmLock = fs.existsSync(path.join(cwd, "pnpm-lock.yaml"));

    let buildCommand = "";

    if (hasPnpmLock) {
      buildCommand = "pnpm run build";
    } else if (hasYarnLock) {
      buildCommand = "yarn build";
    } else {
      buildCommand = "npm run build";
    }

    logger.info(`Executing: ${buildCommand}`);

    execSync(buildCommand, { stdio: "inherit", cwd });

    logger.success(
      "Build completed successfully! Your app is ready for deployment."
    );
    logger.info(
      'The build artifacts can be found in the "build" or "dist" directory.'
    );
  } catch (error) {
    logger.error("Build failed");
    process.exit(1);
  }
};
