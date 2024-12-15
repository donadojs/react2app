import inquirer from "inquirer";
import { spawn } from "node:child_process";
import { Program, PROGRAM_COMMANDS } from "../config/programs.js";
import { logger } from "./logger.js";

export const runSpawn = (
  command: string,
  args: string[] = [],
  options = {}
) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, options);

    let stdout = "";
    let stderr = "";

    // Capture stdout and stderr if they exist
    if (childProcess.stdout) {
      childProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });
    }

    if (childProcess.stderr) {
      childProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });
    }

    childProcess.on("error", (error) => {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        reject(new Error(`${command} is not installed`));
      } else {
        reject(error);
      }
    });

    childProcess.on("exit", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`${command} exited with code ${code}: ${stderr}`));
      }
    });
  });
};

export const promptRequiredProgramsInstall = async () => {
  const { shouldInstall } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldInstall",
      message: "Install required programs?",
    },
  ]);
  return shouldInstall;
};

export async function findMissingPrograms(requiredPrograms: Program[]) {
  const programInstallCheckResults = await Promise.all(
    requiredPrograms.map(async (program) => {
      const isInstalled = await PROGRAM_COMMANDS[program].isInstalled();
      return { program, isInstalled };
    })
  );
  const missingPrograms = programInstallCheckResults
    .filter(({ isInstalled }) => !isInstalled)
    .map(({ program }) => program);

  return missingPrograms;
}

export const ensureRequiredProgramInstalled = async (
  requiredPrograms: Program[]
) => {
  logger.info("Checking required programs...");
  const missingPrograms = await findMissingPrograms(requiredPrograms);
  if (missingPrograms.length > 0) {
    logger.warning(
      `Some of the required programs are not installed. ${missingPrograms.join(", ")}`
    );
    const isAllowed = await promptRequiredProgramsInstall();
    if (!isAllowed) {
      logger.error("Please install the required programs to build.");
      process.exit(1);
    }
    for (const missingProgram of missingPrograms) {
      await PROGRAM_COMMANDS[missingProgram].install();
    }
  }
  logger.success("All required programs are installed.");
};
