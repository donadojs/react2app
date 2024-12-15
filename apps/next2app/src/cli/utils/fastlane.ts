import fs from "fs-extra";
import path from "path";
import { PATHS } from "./path.js";
import { runSpawn } from "./program.js";
import { Platform } from "../constants/index.js";

export const copyFastLaneConfig = async (
  destinationPath: string,
  onError?: (error: Error) => void
) => {
  fs.cp(
    path.join(PATHS.CLI.ROOT, "fastlane"),
    path.join(destinationPath, "fastlane"),
    { recursive: true },
    (error) => {
      if (error) {
        onError?.(error);
        throw error;
      }
    }
  );
};

export const runFastlaneBuild = async (
  platform: Platform,
  cwd: string,
  env: Record<string, string>
) => {
  await runSpawn("fastlane", [platform, "build", "--verbose"], {
    cwd,
    stdio: "inherit",
    env,
  });
};
