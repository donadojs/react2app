import path from "path";
import inquirer from "inquirer";
import inquirerAutocomplete from "inquirer-autocomplete-prompt";
import fs from "fs-extra";
import { logger } from "../utils/logger.js";
import { getPaths } from "../utils/path.js";
import { PLATFORM, Platform } from "../constants/index.js";
import {
  getNotInstalledPrograms,
  handleNotInstalledPrograms,
  PROGRAM,
  runSpawn,
} from "../utils/program.js";

// Register the autocomplete prompt
inquirer.registerPrompt("autocomplete", inquirerAutocomplete);

const buildIOS = async () => {
  const { iosRootDir, R2ACLIRootDir, expoRootDir, R2AConfigPath } =
    await getPaths();

  await prebuildExpoApp(PLATFORM.IOS, expoRootDir);

  // copy fastlane config
  fs.cp(
    path.join(R2ACLIRootDir, "fastlane"),
    path.join(iosRootDir, "fastlane"),
    { recursive: true },
    (error) => {
      if (error) throw error;
    }
  );

  const R2AConfig = await import(R2AConfigPath);
  await runSpawn("fastlane", ["ios", "build_dev", "--verbose"], {
    cwd: iosRootDir,
    stdio: "inherit",
    env: {
      ...process.env,
      APP_NAME: "expoapp", // @todo fix to app name
      TEAM_ID: "999999999",
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
    const { expoRootDir, iosRootDir, R2ACLIRootDir } = await getPaths();

    // Check required programs
    const requiredPrograms = [PROGRAM.XCODE, PROGRAM.FASTLANE];
    const notInstalledPrograms =
      await getNotInstalledPrograms(requiredPrograms);
    if (notInstalledPrograms.length > 0) {
      await handleNotInstalledPrograms(notInstalledPrograms); // feature test needed
    }

    await buildIOS();
    // await buildAndroid();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
};
