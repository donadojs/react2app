import { cleanupN2A } from "../utils/cleanUp.js";
import { initN2AProject } from "../utils/init.js";

export const init = async () => {
  try {
    await initN2AProject();
  } catch (error) {
    cleanupN2A();
    throw error;
  }
};
