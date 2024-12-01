import inquirer from "inquirer";
import { spawn } from "node:child_process";

export const PROGRAM = {
  XCODE: "Xcode",
  FASTLANE: "Fastlane",
  BREW: "Brew",
} as const;

export type Program = (typeof PROGRAM)[keyof typeof PROGRAM];

const programCommands: Record<
  Program,
  {
    version: { command: string; args: string[] };
    install: { command: string; args: string[] };
  }
> = {
  [PROGRAM.XCODE]: {
    version: {
      command: "xcode-select",
      args: ["-v"],
    },
    install: {
      command: "xcode-select",
      args: ["--install"],
    },
  },

  [PROGRAM.BREW]: {
    version: {
      command: "brew",
      args: ["-v"],
    },
    install: {
      command: "/bin/bash",
      args: [
        "-c",
        "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)",
      ],
    },
  },
  [PROGRAM.FASTLANE]: {
    version: {
      command: "fastlane",
      args: ["-v"],
    },
    install: {
      command: "brew",
      args: ["install", "fastlane"],
    },
  },
};

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

const promptProgramInstall = async () => {
  const { shouldInstall } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldInstall",
      message: "Install required programs?",
    },
  ]);
  return shouldInstall;
};

const installPrograms = async (programs: Program[]) => {
  for (const program of programs) {
    await runSpawn(
      programCommands[program].install.command,
      programCommands[program].install.args,
      { stdio: "inherit" }
    );
  }
};

export const handleNotInstalledPrograms = async (
  notInstalledPrograms: Program[]
) => {
  const shouldInstall = await promptProgramInstall();
  if (shouldInstall) {
    await installPrograms(notInstalledPrograms);
  } else {
    process.exit(1);
  }
};
async function isProgramInstalled(program: Program) {
  try {
    await runSpawn(
      programCommands[program].version.command,
      programCommands[program].version.args,
      { stdio: "pipe" }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getNotInstalledPrograms(requiredPrograms: Program[]) {
  const programInstallCheckResults = await Promise.all(
    requiredPrograms.map(async (program) => {
      const isInstalled = await isProgramInstalled(program);
      return { program, isInstalled };
    })
  );
  const notInstalledPrograms = programInstallCheckResults
    .filter(({ isInstalled }) => !isInstalled)
    .map(({ program }) => program);

  return notInstalledPrograms;
}
