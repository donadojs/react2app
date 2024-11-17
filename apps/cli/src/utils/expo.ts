import { spawn } from "child_process";
import { logger } from "./logger.js";
import fs from "fs-extra";
import path from "path";
import type { R2AConfig } from "../types";
import { getPaths } from "./path.js";
import { EXPO_DIR_NAME, EXPO_TEMPLATE_NAME } from "../constants/r2aConfig.js";
import colors from "ansi-colors";
import cliProgress from "cli-progress";
import { updateEnvFile } from "./env.js";
import { devServerConfig } from "./devServer.js";
import { ERROR_CODE } from "../errors/index.js";
import { ERROR_MESSAGES } from "../errors/index.js";
import { ExpoError } from "../errors/index.js";

function syncExpoProject(config: R2AConfig) {}

/**
 * Checks if an Expo project exists in the current directory
 * @returns {Promise<boolean>} Whether an Expo project exists
 */
async function isExpoProjectExist(): Promise<boolean> {
  try {
    const { expoRootDir } = getPaths();
    const expoAppJsonPath = path.join(expoRootDir, "app.json");
    return fs.exists(expoAppJsonPath);
  } catch (error) {
    throw new ExpoError(
      ERROR_MESSAGES.EXPO.PROJECT_NOT_FOUND,
      ERROR_CODE.EXPO.PROJECT_NOT_FOUND
    );
  }
}

export async function createExpoProject(R2AConfig: R2AConfig) {
  try {
    const { R2ARootDir, reactProjectRootDir } = getPaths();
    fs.ensureDirSync(R2ARootDir);

    console.log();
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
      format: `📦 Transforming React to App... |${colors.cyan("{bar}")}| {percentage}% || {state}`,
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
          EXPO_DIR_NAME,
          "--template",
          EXPO_TEMPLATE_NAME,
          "--yes",
        ],
        {
          cwd: R2ARootDir,
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

const initializeEnvFile = async () => {
  const { expoEnvFilePath } = getPaths();
  await fs.ensureFileSync(expoEnvFilePath);

  const host = devServerConfig.react.HOST;
  const port = devServerConfig.react.PORT;
  const webViewUrl = `http://${host}:${port}`;

  await updateEnvFile(expoEnvFilePath, {
    EXPO_PUBLIC_WEBVIEW_URL: webViewUrl,
  });
};

/**
 * Handles Expo project initialization or synchronization
 * @param config The React2App configuration
 * @throws {Error} If project initialization fails
 */
async function initializeExpoProject(config: R2AConfig): Promise<void> {
  try {
    const projectExists = await isExpoProjectExist();
    if (projectExists) {
      await syncExpoProject(config);
    } else {
      await createExpoProject(config);
      await initializeEnvFile();
    }
  } catch (error) {
    throw new ExpoError(
      ERROR_MESSAGES.EXPO.CREATE_FAILED,
      ERROR_CODE.EXPO.CREATE_FAILED
    );
  }
}

export { initializeExpoProject };
