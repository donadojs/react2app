import { DEFAULT_DEV_SERVER_PORT } from "../constants/index.js";
import { FRAMEWORK } from "../constants/index.js";
import {
  createExpoEnvFile,
  createExpoProject,
  updateExpoEnvFile,
} from "../utils/expo.js";
import { getLocalIPAddress } from "../utils/network.js";
import { createR2AConfig } from "../utils/r2aConfig.js";

export const init = async () => {
  try {
    // Setup R2A config
    const newR2AConfig = await createR2AConfig();

    // Setup Expo project
    await createExpoProject(newR2AConfig);

    // Setup Expo env file
    await createExpoEnvFile();
  } catch (error) {
    throw error;
  }
};
