export const R2A_CONFIG_FILENAME = "react2app.config.js";

export const REACT_FRAMEWORK = {
  REACT: "REACT",
  NEXTJS: "NEXTJS",
} as const;

export type ReactFramework =
  (typeof REACT_FRAMEWORK)[keyof typeof REACT_FRAMEWORK];
