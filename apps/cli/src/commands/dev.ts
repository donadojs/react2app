import chalk from "chalk";
import { CommandOptions } from "../types/index.js";
import { logger } from "../utils/logger.js";
import path from "path";
import fs from "fs";
type Platform = "ios" | "android" | "all";

export const dev = async (
  platform: string,
  options: CommandOptions
): Promise<void> => {
  try {
    // validate platform (ios,android,all)
    if (platform !== "ios" && platform !== "android" && platform !== "all") {
      logger.error("Invalid platform. Please use ios, android, or all.");
      process.exit(1);
    }

    // validate if we're in a react or nextjs project
    const cwd = process.cwd();
    if (!fs.existsSync(path.join(cwd, "package.json"))) {
      logger.error(
        "No package.json found. Please run this command in your project root directory."
      );
      process.exit(1);
    }

    // Generate react2app.config.js file if it doesn't exist
    const configPath = path.join(cwd, "react2app.config.js");
    console.log(configPath);
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, "module.exports = {};");
    }

    // Load config
    const { default: react2appConfig } = await import(configPath);
    console.log(react2appConfig.ios);

    console.log(
      chalk.blue(
        "Starting development server for",
        platform,
        ",",
        react2appConfig.ios.bundleId
      )
    );
    // Add development server logic here
  } catch (error) {
    console.error(chalk.red("Failed to start development server"));
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
