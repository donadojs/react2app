import chalk from "chalk";

export const logger = {
  info: (message: string, color = chalk.blue) => console.log(color(message)),
  success: (message: string) => console.log(chalk.green(message)),
  warning: (message: string) => console.log(chalk.yellow(message)),
  error: (message: string) => console.log(chalk.red(message)),
};
