import { devServerConfig } from "../utils/devServer";
import {
  createExpoEnvFile,
  createExpoProject,
  updateExpoEnvFile,
} from "../utils/expo";
import { createR2AConfig } from "../utils/r2aConfig";

export const init = async () => {
  try {
    // Setup R2A config
    const newR2AConfig = await createR2AConfig();

    // Setup Expo project
    await createExpoProject(newR2AConfig);

    // Setup Expo env file
    await createExpoEnvFile();
    await updateExpoEnvFile({
      EXPO_PUBLIC_WEBVIEW_URL: `http://${devServerConfig.react.HOST}:${devServerConfig.react.PORT}`,
    });
  } catch (error) {
    throw error;
  }
};
