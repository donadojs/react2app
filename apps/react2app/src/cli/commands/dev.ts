// src/commands/dev.ts
import chalk from "chalk";
import getPort from "get-port";
import { DevCommandOptions } from "../types/index.js";
import { runDevServer } from "../utils/devServer.js";
import { logger } from "../utils/logger.js";
import { loadR2AConfig } from "../utils/config.js";
import { updateExpoEnvFile } from "../utils/expo.js";
import { doctor } from "./doctor.js";
import { addAppLayout } from "../utils/ux.js";
import { cleanupR2A } from "../utils/cleanup.js";
import { getLocalIPAddress, validatePort } from "../utils/network.js";
import { frameworks } from "../config/frameworks.js";
import { initR2AProject } from "../utils/init.js";
import { PATHS, validateProjectRoot } from "../utils/path.js";
import { syncR2AConfigWithExpo } from "../utils/sync.js";

export const dev = async (
  platform: string,
  options: DevCommandOptions
): Promise<void> => {
  try {
    validateProjectRoot();
    const R2AConfig = await loadR2AConfig();
    const isFirstExecution = !R2AConfig;

    if (isFirstExecution) {
      await initR2AProject();
      await addAppLayout();
    } else {
      await doctor();
      await syncR2AConfigWithExpo();
    }

    const cliOptionHost = options.host;
    const cliOptionPort = options.port;
    const defaultHost = getLocalIPAddress();
    const defaultPort = await getPort({ port: frameworks.nextjs.defaultPort });

    const webHost = cliOptionHost || defaultHost;
    const webPort =
      cliOptionPort && validatePort(cliOptionPort)
        ? cliOptionPort
        : defaultPort;
    const expoHost = cliOptionHost || defaultHost;
    const expoPort = await getPort({ port: frameworks.expo.defaultPort });

    const webviewUrl = `http://${webHost}:${webPort}`;
    await updateExpoEnvFile({
      EXPO_PUBLIC_WEBVIEW_URL: webviewUrl,
    });

    runDevServer({
      webServer: {
        framework: frameworks.nextjs,
        host: webHost,
        port: Number(webPort),
        debug: options.debug,
        cwd: PATHS.REACT.ROOT,
        logColor: chalk.blue,
      },
      appServer: {
        framework: frameworks.expo,
        host: expoHost,
        port: Number(expoPort),
        debug: options.debug,
        cwd: (await PATHS.getExpoPaths()).ROOT,
        logColor: chalk.yellow,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      await cleanupR2A();
    }
  }
};
