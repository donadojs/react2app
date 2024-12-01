import { createExpoEnvFile, createExpoProject } from "../utils/expo.js";
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
