import fs from "fs-extra";
import path from "path";
import { PATHS } from "./path.js";
import { FILE_NAMES } from "../config/constants.js";

export const syncN2AConfigWithExpo = async () => {
  // read N2A config
  const { default: N2AConfig } = await import(PATHS.N2A.CONFIG_FILE);
  const { projectName, appId, displayName } = N2AConfig;

  // read Expo config
  const { ROOT: EXPO_ROOT } = await PATHS.getExpoPaths();
  const appConfigPath = path.join(EXPO_ROOT, FILE_NAMES.EXPO.APP_CONFIG);
  const existingConfig = await fs.readJson(appConfigPath).catch(() => ({}));

  // Update
  const expoConfig = {
    ...existingConfig,
    expo: {
      ...existingConfig.expo,
      name: displayName,
      slug: projectName,
      ios: {
        ...existingConfig.expo?.ios,
        bundleIdentifier: appId,
      },
      android: {
        ...existingConfig.expo?.android,
        package: appId,
      },
    },
  };
  await fs.writeJson(appConfigPath, expoConfig, { spaces: 2 });
};
