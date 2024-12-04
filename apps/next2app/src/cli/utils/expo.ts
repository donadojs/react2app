import { spawn } from "child_process";
import fs from "fs-extra";
import colors from "ansi-colors";
import cliProgress from "cli-progress";
import type { N2AConfig } from "../types/index.js";
import { PATHS } from "./path.js";
import { updateEnvFile } from "./env.js";
import { ERROR_CODE } from "../errors/index.js";
import { ERROR_MESSAGES } from "../errors/index.js";
import { ExpoError } from "../errors/index.js";
import { FILE_NAMES, DIRECTORY_NAMES } from "../config/constants.js";
import path from "path";

/**
 * Checks if an Expo project exists in the current directory
 * @returns {Promise<boolean>} Whether an Expo project exists
 */
export async function checkExpoProjectExist(): Promise<boolean> {
  try {
    const { CONFIG_FILE } = await PATHS.getExpoPaths();
    return fs.exists(CONFIG_FILE);
  } catch (error) {
    return false;
  }
}

export async function checkExpoEnvFileExist(): Promise<boolean> {
  const { ENV_FILE } = await PATHS.getExpoPaths();
  return fs.exists(ENV_FILE);
}

export async function createExpoProject(projectName: string) {
  try {
    const N2ARootDir = PATHS.N2A.ROOT;
    fs.ensureDirSync(N2ARootDir);

    const progressBarPhases = [
      {
        range: [0, 10],
        message: "Creating project directory",
        duration: 3000,
      },
      { range: [10, 20], message: "Installing Expo CLI", duration: 3000 },
      {
        range: [20, 30],
        message: "Setting up project template",
        duration: 4000,
      },
      {
        range: [30, 95],
        message: "Installing dependencies",
        duration: 20000,
      },
    ];

    const progressBar = new cliProgress.SingleBar({
      format: `📦 Transforming React to App... |${colors.cyan("{bar}")}| {percentage}%`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
      clearOnComplete: false,
      fps: 300,
    });
    progressBar.start(100, 0, { state: "Preparing environment" });

    await new Promise((resolve, reject) => {
      const process = spawn(
        "npx",
        [
          "create-expo-app",
          projectName,
          "--template",
          FILE_NAMES.EXPO.TEMPLATE,
          "--yes",
        ],
        {
          cwd: N2ARootDir,
          stdio: ["ignore", "pipe", "pipe"],
          shell: true,
        }
      );

      let currentPhase = 0;
      let currentProgress = 0;

      const updateProgress = () => {
        const phase = progressBarPhases[currentPhase];
        const [start, end] = phase.range;
        const timePerPercent = phase.duration / (end - start);

        const interval = setInterval(() => {
          if (currentProgress < end) {
            currentProgress++;
            progressBar.update(currentProgress, { state: phase.message });
          } else {
            clearInterval(interval);
            if (currentPhase < progressBarPhases.length - 1) {
              currentPhase++;
              updateProgress();
            }
          }
        }, timePerPercent);

        return interval;
      };

      const progressInterval = updateProgress();

      const timeout = setTimeout(() => {
        clearInterval(progressInterval);
        process.kill();
        progressBar.stop();
        reject(new Error("Process timed out"));
      }, 300000);

      process.on("close", (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          // Smooth completion from current progress to 100%
          const remainingSteps = 100 - currentProgress;
          const finalInterval = setInterval(() => {
            if (currentProgress < 100) {
              currentProgress++;
              progressBar.update(currentProgress, {
                state: "Finalizing installation",
              });
            } else {
              progressBar.update(currentProgress, {
                state: "Complete!",
              });
              clearInterval(finalInterval);
              progressBar.stop();
              resolve(code);
            }
          }, 20); // Final progress speed (20ms per 1%)
        } else {
          progressBar.stop();
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      process.on("error", (err) => {
        clearTimeout(timeout);
        progressBar.stop();
        reject(err);
      });
    });
  } catch (error) {
    throw new ExpoError(
      ERROR_MESSAGES.EXPO.CREATE_FAILED,
      ERROR_CODE.EXPO.CREATE_FAILED
    );
  }
}

export const createExpoEnvFile = async () => {
  const { ENV_FILE } = await PATHS.getExpoPaths();
  await fs.ensureFileSync(ENV_FILE);
};

export const updateExpoEnvFile = async (env: Record<string, string>) => {
  const { ENV_FILE } = await PATHS.getExpoPaths();
  await updateEnvFile(ENV_FILE, env);
};
export async function validateExpoProject(config: N2AConfig) {
  // Check if Expo project exists
  const projectExists = await checkExpoProjectExist();
  if (!projectExists) {
    throw new ExpoError(
      ERROR_MESSAGES.EXPO.PROJECT_NOT_FOUND,
      ERROR_CODE.EXPO.PROJECT_NOT_FOUND
    );
  }

  // Check if Expo env file exists
  const envFileExists = await checkExpoEnvFileExist();
  if (!envFileExists) {
    throw new ExpoError(
      ERROR_MESSAGES.EXPO.ENV_FILE_NOT_FOUND,
      ERROR_CODE.EXPO.ENV_FILE_NOT_FOUND
    );
  }
}
