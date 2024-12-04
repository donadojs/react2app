import { createExpoEnvFile, createExpoProject } from "../utils/expo.js";
import { createR2AConfig } from "./config.js";
import { updateEnvFile } from "./env.js";
import { PATHS } from "./path.js";
import Conf from "conf";
import { convertPackageNameToAppId } from "./packageName.js";
import { convertPackageNameToDisplayName } from "./packageName.js";
import { convertPackageNameToProjectName } from "./packageName.js";
import fs from "fs-extra";
import { syncR2AConfigWithExpo } from "./sync.js";

export const initR2AProject = async () => {
  try {
    // Setup R2A config
    await createR2AConfig();

    // Create value based on user's package name
    const projectRoot = PATHS.PROJECT_ROOT;
    const packageJson = new Conf({
      cwd: projectRoot,
      configName: "package",
      fileExtension: "json",
    });
    const packageName = packageJson.get("name") as string;
    const projectName = convertPackageNameToProjectName(packageName);
    const displayName = convertPackageNameToDisplayName(packageName);
    const appId = convertPackageNameToAppId(packageName);

    // Update R2A config
    const { default: R2AConfig } = await import(PATHS.R2A.CONFIG_FILE);
    R2AConfig.projectName = projectName;
    R2AConfig.displayName = displayName;
    R2AConfig.appId = appId;

    // Read the template file first
    const template = await fs.readFile(PATHS.CLI.CONFIG_TEMPLATE, "utf-8");
    const configContent = template
      .replace(/projectName:\s*null/, `projectName: "${projectName}"`)
      .replace(/displayName:\s*null/, `displayName: "${displayName}"`)
      .replace(/appId:\s*null/, `appId: "${appId}"`);
    await fs.writeFile(PATHS.R2A.CONFIG_FILE, configContent);

    // Update react project .env.local file
    await fs.ensureFile(PATHS.REACT.ENV_FILE);
    await updateEnvFile(PATHS.REACT.ENV_FILE, {
      R2A_IOS_TEAM_ID: "PUT_YOUR_TEAM_ID_HERE",
    });

    // Setup Expo project
    await createExpoProject(projectName);

    await syncR2AConfigWithExpo();

    // Setup Expo env file
    await createExpoEnvFile();
  } catch (error) {
    throw error;
  }
};
