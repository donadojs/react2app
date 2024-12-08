// src/commands/dev.ts
import chalk from "chalk";
import getPort from "get-port";
import { DevCommandOptions } from "../types/index.js";
import { runDevServer } from "../utils/devServer.js";
import { logger } from "../utils/logger.js";
import { loadN2AConfig as loadN2AConfig } from "../utils/config.js";
import { updateExpoEnvFile } from "../utils/expo.js";
import { doctor } from "./doctor.js";
import { addAppLayout } from "../utils/ux.js";
import { cleanupN2A } from "../utils/cleanUp.js";
import { getLocalIPAddress, validatePort } from "../utils/network.js";
import { frameworks } from "../config/frameworks.js";
import { initN2AProject as initN2AProject } from "../utils/init.js";
import { PATHS, validateProjectRoot } from "../utils/path.js";
import { syncN2AConfigWithExpo } from "../utils/sync.js";

export const dev = async (
  platform: string,
  options: DevCommandOptions
): Promise<void> => {
  try {
    validateProjectRoot();
    const N2AConfig = await loadN2AConfig();
    const isFirstExecution = !N2AConfig;

    if (isFirstExecution) {
      await initN2AProject();
    } else {
      await doctor();
      await syncN2AConfigWithExpo();
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
        cwd: PATHS.NEXTJS.ROOT,
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
      await cleanupN2A();
    }
  }
};
