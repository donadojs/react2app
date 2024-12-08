import { createExpoEnvFile, createExpoProject } from "../utils/expo.js";
import { createN2AConfig } from "./config.js";
import { updateEnvFile } from "./env.js";
import { PATHS } from "./path.js";
import Conf from "conf";
import { convertPackageNameToAppId } from "./packageName.js";
import { convertPackageNameToDisplayName } from "./packageName.js";
import { convertPackageNameToProjectName } from "./packageName.js";
import fs from "fs-extra";
import { syncN2AConfigWithExpo } from "./sync.js";
import { addAppLayout } from "./ux.js";

export const initN2AProject = async () => {
  try {
    // Setup N2A config
    await createN2AConfig();

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

    // Update N2A config
    const { default: N2AConfig } = await import(PATHS.N2A.CONFIG_FILE);
    N2AConfig.projectName = projectName;
    N2AConfig.displayName = displayName;
    N2AConfig.appId = appId;

    // Read the template file first
    const template = await fs.readFile(PATHS.CLI.CONFIG_TEMPLATE, "utf-8");
    const configContent = template
      .replace(/projectName:\s*null/, `projectName: "${projectName}"`)
      .replace(/displayName:\s*null/, `displayName: "${displayName}"`)
      .replace(/appId:\s*null/, `appId: "${appId}"`);
    await fs.writeFile(PATHS.N2A.CONFIG_FILE, configContent);

    // Update react project .env.local file
    await fs.ensureFile(PATHS.NEXTJS.ENV_FILE);
    await updateEnvFile(PATHS.NEXTJS.ENV_FILE, {
      N2A_IOS_TEAM_ID: "PUT_YOUR_TEAM_ID_HERE",
    });

    // Setup Expo project
    await createExpoProject(projectName);

    await syncN2AConfigWithExpo();

    // Setup Expo env file
    await createExpoEnvFile();

    // Add <AppLayout> to the root of the project
    await addAppLayout();
  } catch (error) {
    throw error;
  }
};
