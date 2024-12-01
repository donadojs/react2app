import { cleanupR2A } from "../utils/cleanup.js";
import { initR2AProject } from "../utils/init.js";

export const init = async () => {
  try {
    await initR2AProject();
  } catch (error) {
    cleanupR2A();
    throw error;
  }
};
