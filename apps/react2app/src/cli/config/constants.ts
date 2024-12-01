// Directory names
export const DIRECTORY_NAMES = {
  R2A: "react2app",
  TEMPLATES: "templates",
} as const;

// File names organized by project
export const FILE_NAMES = {
  R2A: {
    CONFIG: "react2app.config.js",
    CONFIG_TEMPLATE: "react2app.config.template.js",
  },
  REACT: {
    ENV: ".env.local",
    CONFIG: "next.config.js",
  },
  EXPO: {
    ENV: ".env",
    APP_CONFIG: "app.json",
    CONFIG: "app.json",
    TEMPLATE: "@react2app/expo-template",
  },
} as const;
