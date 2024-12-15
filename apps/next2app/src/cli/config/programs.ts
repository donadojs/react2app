import { runSpawn } from "../utils/program.js";

export const PROGRAM = {
  XCODE: "Xcode",
  FASTLANE: "Fastlane",
  BREW: "Brew",
  ANDROID_STUDIO: "Android Studio",
} as const;

export type Program = (typeof PROGRAM)[keyof typeof PROGRAM];

export const PROGRAM_COMMANDS: Record<
  Program,
  {
    version?: { command: string; args: string[] };
    install: () => Promise<void>;

    isInstalled: () => Promise<boolean>;
  }
> = {
  [PROGRAM.XCODE]: {
    install: async () => {
      await runSpawn("xcode-select", ["--install"], { stdio: "pipe" });
    },
    isInstalled: async () => {
      try {
        await runSpawn("xcode-select", ["-v"], { stdio: "pipe" });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },

  [PROGRAM.BREW]: {
    install: async () => {
      await runSpawn("/bin/bash", [
        "-c",
        "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)",
      ]);
    },
    isInstalled: async () => {
      try {
        await runSpawn("brew", ["-v"], { stdio: "pipe" });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
  [PROGRAM.FASTLANE]: {
    install: async () => {
      await runSpawn("brew", ["install", "fastlane"], { stdio: "pipe" });
    },
    isInstalled: async () => {
      try {
        await runSpawn("fastlane", ["-v"], { stdio: "pipe" });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
  [PROGRAM.ANDROID_STUDIO]: {
    isInstalled: async () => {
      try {
        await runSpawn(
          "/Applications/Android Studio.app/Contents/MacOS/studio",
          ["--help"],
          { stdio: "pipe" }
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    install: async () => {
      console.log(
        "Install Android Studio at: https://developer.android.com/studio and run 'next2app build android' again"
      );
      process.exit(1);
    },
  },
};

export const COMMON_REQUIRED_PROGRAMS = [PROGRAM.BREW, PROGRAM.FASTLANE];
export const IOS_REQUIRED_PROGRAMS = [PROGRAM.XCODE];
export const ANDROID_REQUIRED_PROGRAMS = [PROGRAM.ANDROID_STUDIO];
