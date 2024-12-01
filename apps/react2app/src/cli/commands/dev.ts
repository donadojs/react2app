// src/commands/dev.ts
import chalk from "chalk";
import getPort from "get-port";
import { DevCommandOptions } from "../types/index.js";
import { runDevServer } from "../utils/devServer.js";
import { logger } from "../utils/logger.js";
import { ensureReactProjectRootDir, getPaths } from "../utils/path.js";
import { loadR2AConfig } from "../utils/r2aConfig.js";
import { syncExpoProject, updateExpoEnvFile } from "../utils/expo.js";
import { init } from "./init.js";
import { doctor } from "./doctor.js";
import { addAppLayout } from "../utils/ux.js";
import { cleanupR2A } from "../utils/cleanup.js";
import { getLocalIPAddress, validatePort } from "../utils/network.js";
import { frameworks } from "../config/frameworks.js";

export const dev = async (
  platform: string,
  options: DevCommandOptions
): Promise<void> => {
  try {
    const { reactProjectRootDir, expoRootDir } = getPaths();
    ensureReactProjectRootDir();
    const R2AConfig = await loadR2AConfig();
    const isFirstExecution = !R2AConfig;

    if (isFirstExecution) {
      await init();
      await addAppLayout();
    } else {
      await doctor();
      await syncExpoProject(R2AConfig);
    }

    // Getting proper host and port

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

    // Update Expo env file with webview url
    const webviewUrl = `http://${webHost}:${webPort}`;
    await updateExpoEnvFile({
      EXPO_PUBLIC_WEBVIEW_URL: webviewUrl,
    });

    // Run dev server
    runDevServer({
      webServer: {
        framework: frameworks.nextjs,
        host: webHost,
        port: Number(webPort),
        debug: options.debug,
        cwd: reactProjectRootDir,
        logColor: chalk.blue,
      },
      appServer: {
        framework: frameworks.expo,
        host: expoHost,
        port: Number(expoPort),
        debug: options.debug,
        cwd: expoRootDir,
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
