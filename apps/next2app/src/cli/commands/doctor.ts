import { loadN2AConfig } from "../utils/config.js";
import { validateExpoProject } from "../utils/expo.js";
import { validateN2AConfig } from "../utils/validation.js";
import { ConfigError, ERROR_CODE, ERROR_MESSAGES } from "../errors/index.js";
import ora from "ora";
import chalk from "chalk";

export const doctor = async () => {
  const checks = [
    {
      name: "Loading N2A Config",
      task: async () => {
        const config = await loadN2AConfig();
        if (!config) {
          throw new ConfigError(
            ERROR_MESSAGES.CONFIG.NOT_FOUND,
            ERROR_CODE.CONFIG.NOT_FOUND
          );
        }
        return config;
      },
    },
    {
      name: "Validating N2A Config",
      task: (config: any) => validateN2AConfig(config),
    },
    {
      name: "Validating Expo Project",
      task: (config: any) => validateExpoProject(config),
    },
  ];

  let lastConfig;

  for (const check of checks) {
    const spinner = ora(check.name).start();
    try {
      lastConfig = await check.task(lastConfig);
      spinner.succeed(chalk.white(check.name));
    } catch (error) {
      spinner.fail(chalk.red(check.name));

      if (error instanceof ConfigError) {
        console.log("\n" + chalk.red("Error: ") + chalk.yellow(error.message));
        if (error.details) {
          console.log(chalk.dim("\nDetails:"));
          console.log(chalk.dim(error.details));
        }
        console.log("\n" + chalk.dim(`Error Code: ${error.code}`));
      } else {
        console.log("\n" + chalk.red("Error: ") + error);
      }

      process.exit(1);
    }
  }

  return;
};
