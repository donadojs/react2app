import path from "path";
import inquirer from "inquirer";
import inquirerAutocomplete from "inquirer-autocomplete-prompt";
import fs from "fs-extra";
import { logger } from "../utils/logger.js";
import { PLATFORM, Platform } from "../constants/index.js";
import {
  getNotInstalledPrograms,
  handleNotInstalledPrograms,
  PROGRAM,
  runSpawn,
} from "../utils/program.js";
import { PATHS } from "../utils/path.js";

// Register the autocomplete prompt
inquirer.registerPrompt("autocomplete", inquirerAutocomplete);

const buildIOS = async () => {
  const expoPaths = await PATHS.getExpoPaths();
  const expoRootDir = expoPaths.ROOT;
  const iosRootDir = path.join(expoRootDir, "ios");
  const N2ACLIRootDir = PATHS.CLI.ROOT;
  const N2AConfigPath = PATHS.N2A.CONFIG_FILE;

  await prebuildExpoApp(PLATFORM.IOS, expoRootDir);

  // copy fastlane config
  fs.cp(
    path.join(N2ACLIRootDir, "fastlane"),
    path.join(iosRootDir, "fastlane"),
    { recursive: true },
    (error) => {
      if (error) throw error;
    }
  );

  const { default: N2AConfig } = await import(N2AConfigPath);
  await runSpawn("fastlane", ["ios", "build", "--verbose"], {
    cwd: iosRootDir,
    stdio: "inherit",
    env: {
      ...process.env,
      APP_NAME: N2AConfig.displayName.replace(/\s/g, ""),
      TEAM_ID: N2AConfig.ios.teamId,
    },
  });
};

const prebuildExpoApp = async (platform: Platform, cwd: string) => {
  await runSpawn("npx", ["expo", "prebuild", "--platform", platform], {
    cwd,
    stdio: "pipe",
  });
};

const buildAndroid = async () => {
  // To be continued...
};

export const build = async () => {
  try {
    // Check required programs
    logger.info("Checking required programs...");
    const requiredPrograms = [PROGRAM.XCODE, PROGRAM.FASTLANE];
    const notInstalledPrograms =
      await getNotInstalledPrograms(requiredPrograms);
    if (notInstalledPrograms.length > 0) {
      logger.warning("Some of the required programs are not installed.");
      console.log(notInstalledPrograms);
      await handleNotInstalledPrograms(notInstalledPrograms); // feature test needed
    }

    logger.success("All required programs are installed.");

    await buildIOS();
    // await buildAndroid();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
};
