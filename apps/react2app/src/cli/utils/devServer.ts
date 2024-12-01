import { spawn, type ChildProcess } from "child_process";
import chalk from "chalk";
import { BaseError } from "../errors/index.js";
import type {
  FrameworkConfig,
  DevServerOptions,
  R2ADevServerOptions,
} from "../types/framework.js";
import { logger } from "./logger.js";
import qrcode from "qrcode-terminal";

interface ServerInfo {
  host: string;
  port: number;
  scheme?: string;
}

const printDevServerInfo = (webServer: ServerInfo, appServer: ServerInfo) => {
  const formatUrl = (server: ServerInfo) =>
    server.scheme
      ? `${server.scheme}://${server.host}:${server.port}`
      : `${server.host}:${server.port}`;

  const messages = [
    "",
    chalk.green("🚀 Server is running at:\n"),
    chalk.blue(`  Web: ${formatUrl(webServer)}`),
    chalk.blue(`  App: ${formatUrl(appServer)}`),
    "",
  ];
  messages.forEach((msg) => console.log(msg));

  // For Expo QR code, we specifically need the exp:// scheme
  qrcode.generate(`exp://${appServer.host}:${appServer.port}`, { small: true });

  const instructions = [
    "",
    chalk.yellow(
      "📱 Download 'Expo Go' app from App Store/Play Store and scan the QR code with phone camera\n"
    ),
    chalk.gray("💡 App not installed? Get it at https://expo.dev/expo-go"),
  ];

  instructions.forEach((msg) => console.log(msg));
};

export class DevServer {
  private process?: ChildProcess;
  private isReady = false;
  private scheme = "http";
  private host?: string;
  private port?: number;
  private framework: FrameworkConfig;
  private options: DevServerOptions;
  private logColor: typeof chalk;
  private cwd?: string;

  constructor(options: DevServerOptions) {
    this.framework = options.framework;
    this.options = options;
    this.logColor = options.logColor || chalk.blue;
    this.host = options.host;
    this.port = options.port;
    this.cwd = options.cwd;
  }

  getServerInfo(): ServerInfo {
    if (!this.host || !this.port) {
      throw new Error("Error while getting server info: Server not started");
    }
    return {
      host: this.host,
      port: this.port,
      scheme: this.scheme,
    };
  }

  async start(): Promise<void> {
    try {
      const devCommand = await this.framework.getDevCommand({
        host: this.host,
        port: this.port,
      });

      await new Promise<void>((resolve, reject) => {
        this.process = spawn(devCommand.command, devCommand.args, {
          stdio: "pipe",
          shell: false,
          env: {
            ...process.env,
            ...devCommand.env,
          },
          cwd: this.cwd,
        });
        this.setupLogging();
        this.setupErrorHandling(reject);
        this.waitForReady(resolve);
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isPermissionError = errorMessage.includes("EACCES");

      throw new BaseError(
        `Failed to start ${this.framework.name} server`,
        "SERVER_START_FAILED",
        isPermissionError
          ? `Permission denied for port ${this.port}. Please use a port number above 1024.`
          : errorMessage
      );
    }
  }

  private setupLogging(): void {
    this.process?.stdout?.on("data", (data) => {
      const message = data.toString();
      if (this.isReady || this.options.debug) {
        const lines = message
          .split("\n")
          .map((line: string) =>
            line.trim()
              ? `${this.logColor(this.framework.logPrefix)} ${line}`
              : line
          )
          .join("\n");
        process.stdout.write(lines);
      }
    });

    this.process?.stderr?.on("data", (data) => {
      if (this.options.debug) {
        const message = data.toString();
        process.stderr.write(
          chalk.red(`${this.framework.logPrefix} ${message}`)
        );
      }
    });
  }

  private setupErrorHandling(reject: (reason?: any) => void): void {
    this.process?.on("error", (error) => {
      logger.error(`${this.framework.name} server failed: ${error.message}`);
      reject(error);
    });
  }

  private waitForReady(resolve: () => void): void {
    if (this.options.debug) {
      logger.info(
        `${this.framework.logPrefix} Waiting for ready message: "${this.framework.readyMessage}"`,
        this.logColor
      );
    }

    this.process?.stdout?.on("data", (data) => {
      const message = data.toString();
      if (message.includes(this.framework.readyMessage)) {
        this.isReady = true;
        if (this.options.debug) {
          logger.info(
            `${this.framework.logPrefix} Server is ready!`,
            this.logColor
          );
        }
        resolve();
      }
    });
  }

  kill(): void {
    this.process?.kill();
  }

  getEnv() {
    return {
      PORT: (this.port ?? 3000).toString(),
      ...process.env,
      ...this.framework.env,
    };
  }
}

export async function runDevServer(options: R2ADevServerOptions) {
  try {
    const webServer = new DevServer(options.webServer);
    const appServer = new DevServer(options.appServer);
    await Promise.all([webServer.start(), appServer.start()]);
    printDevServerInfo(webServer.getServerInfo(), appServer.getServerInfo());
    setupServerKill(webServer, appServer);
  } catch (error) {
    logger.error("Failed to start development servers");
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error;
  }
}

function setupServerKill(webServer: DevServer, appServer: DevServer): void {
  const cleanup = () => {
    webServer.kill();
    appServer.kill();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}
