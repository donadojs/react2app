import chalk from "chalk";
import qrcode from "qrcode-terminal";
import { ChildProcess, spawn } from "child_process";
import { networkInterfaces } from "os";
import { logger } from "./logger.js";
import { ensureReactProjectRootDir, getPaths } from "./path.js";
import { REACT_FRAMEWORK, ReactFramework } from "../constants/index.js";
import { determineReactFramework } from "./project.js";
import {
  ERROR_CODE,
  ERROR_MESSAGES,
  ExpoError,
  WebError,
  DevServerError,
} from "../errors/index.js";

export const getLocalIPAddress = (): string => {
  const nets = networkInterfaces();
  let localIP = "127.0.0.1"; // default to localhost

  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (!interfaces) continue;

    for (const net of interfaces) {
      // Skip internal and non-IPv4 addresses
      if (!net.internal && net.family === "IPv4") {
        localIP = net.address;
        return localIP;
      }
    }
  }
  return localIP;
};

export const devServerConfig = {
  react: {
    HOST: getLocalIPAddress(),
    PORT: "3000",
  },
  expo: {
    HOST: getLocalIPAddress(),
    PORT: "8081",
  },
};

const devServerCommand: Record<
  ReactFramework,
  { command: string; args: string[] }
> = {
  [REACT_FRAMEWORK.NEXTJS]: {
    command: "npx",
    args: [
      "next",
      "dev",
      "-H",
      devServerConfig.react.HOST,
      "-p",
      devServerConfig.react.PORT,
    ],
  },
  [REACT_FRAMEWORK.REACT]: {
    command: "npm",
    args: ["run", "start"],
  },
};

const runReactDevServer = async (): Promise<ChildProcess> => {
  const READY_MESSAGE = "Ready";
  try {
    const rootDir = ensureReactProjectRootDir();
    const userFramework = determineReactFramework(rootDir);
    const { command, args } = devServerCommand[userFramework];
    const promise = new Promise<ChildProcess>((resolve, reject) => {
      const reactDevServerProcess = spawn(command, args, {
        cwd: rootDir,
        stdio: "pipe",
        shell: process.platform === "win32",
        env: {
          ...process.env,
          HOST: devServerConfig.react.HOST,
          PORT: devServerConfig.react.PORT,
        },
      });
      let isLogging = false;

      // If the process READY_MESSAGE doesn't appear within 5 seconds, resolve it
      setTimeout(() => {
        resolve(reactDevServerProcess);
      }, 5000);

      reactDevServerProcess.stdout?.on("data", (data) => {
        const message = data.toString();
        if (message.includes(READY_MESSAGE)) {
          resolve(reactDevServerProcess);
          isLogging = true;
        }
        if (isLogging && !message.includes("Ready")) {
          const prefixedMessage = message
            .split("\n")
            .map((line: string) => (line.trim() ? `[Web] ${line}` : line))
            .join("\n");
          process.stdout.write(prefixedMessage);
        }
      });
      reactDevServerProcess.stderr?.on("data", (data) => {});
    });
    return promise;
  } catch (error) {
    throw new WebError(
      ERROR_MESSAGES.WEB.SERVER_FAILED,
      ERROR_CODE.WEB.SERVER_FAILED
    );
  }
};

const runExpoDevServer = async (): Promise<ChildProcess> => {
  const READY_MESSAGE = "Logs for your project will appear below";
  try {
    const { expoRootDir } = getPaths();

    const promise = new Promise<ChildProcess>((resolve, reject) => {
      const expoDevServerProcess = spawn("npx", ["expo", "start"], {
        cwd: expoRootDir,
        stdio: "pipe",
        shell: true,
        env: {
          ...process.env,
          HOST: devServerConfig.expo.HOST,
          PORT: devServerConfig.expo.PORT,
        },
      });
      let isLogging = false;
      expoDevServerProcess.stdout?.on("data", (data) => {
        const message = data.toString();

        if (message.includes(READY_MESSAGE)) {
          resolve(expoDevServerProcess);
          isLogging = true;
          return;
        }
        if (isLogging) {
          const prefixedMessage = message
            .split("\n")
            .map((line: string) =>
              line.trim() ? chalk.blue(`[App]`) + line : line
            )
            .join("\n");

          process.stdout.write(prefixedMessage);
        }
      });
      expoDevServerProcess.stderr?.on("data", (data) => {});
    });
    return promise;
  } catch (error) {
    throw new ExpoError(
      ERROR_MESSAGES.EXPO.SERVER_FAILED,
      ERROR_CODE.EXPO.SERVER_FAILED
    );
  }
};

const printDevSeverInfo = (webServerUrl: string, appServerUrl: string) => {
  console.log();
  console.log(chalk.green("🚀 Server is running at:\n"));
  console.log(chalk.blue(`  Web: http://${webServerUrl}`));
  console.log(chalk.blue(`  App: http://${appServerUrl}`));
  console.log();

  qrcode.generate(`exp://${appServerUrl}`, { small: true });

  console.log();
  console.log(
    chalk.yellow(
      "📱 Download 'Expo Go' app from App Store/Play Store and scan the QR code with phone camera\n"
    )
  );

  console.log(
    chalk.gray("💡 App not installed? Get it at https://expo.dev/expo-go")
  );
};

export const runDevServer = async () => {
  try {
    const webServerProcess = await runReactDevServer();
    const appServerProcess = await runExpoDevServer();

    const webServerUrl = `${devServerConfig.react.HOST}:${devServerConfig.react.PORT}`;
    const appServerUrl = `${devServerConfig.expo.HOST}:${devServerConfig.expo.PORT}`;

    printDevSeverInfo(webServerUrl, appServerUrl);

    // Handle errors for both processes
    webServerProcess.on("error", (error) => {
      logger.error(`Web server failed: ${error.message}`);
    });

    appServerProcess.on("error", (error) => {
      logger.error(`App server failed: ${error.message}`);
    });

    // Make sure child processes detach properly
    const cleanup = () => {
      // Send SIGINT to child processes
      webServerProcess?.kill();
      appServerProcess?.kill();

      // Force exit after a short delay if processes don't exit cleanly
      setTimeout(() => {
        logger.info("Force exiting...");
        process.exit(0);
      }, 1000);
    };

    // Handle Ctrl+C (SIGINT)
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    // Also handle child process termination
    webServerProcess.on("exit", () => {
      appServerProcess?.kill();
      process.exit(0);
    });

    appServerProcess.on("exit", () => {
      webServerProcess?.kill();
      process.exit(0);
    });
  } catch (error) {
    throw new DevServerError(
      ERROR_MESSAGES.DEV_SERVER.SERVER_FAILED,
      ERROR_CODE.DEV_SERVER.SERVER_FAILED
    );
  }
};
