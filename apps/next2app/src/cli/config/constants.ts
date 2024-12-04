// Directory names
export const DIRECTORY_NAMES = {
  N2A: "next2app",
  TEMPLATES: "templates",
} as const;

// File names organized by project
export const FILE_NAMES = {
  N2A: {
    CONFIG: "next2app.config.js",
    CONFIG_TEMPLATE: "next2app.config.template.js",
  },
  REACT: {
    ENV: ".env.local",
    CONFIG: "next.config.js",
  },
  EXPO: {
    ENV: ".env",
    APP_CONFIG: "app.json",
    CONFIG: "app.json",
    TEMPLATE: "@next2app/expo-template",
  },
} as const;
