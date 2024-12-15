export const N2A_CONFIG_FILENAME = "next2app.config.js";

export const REACT_FRAMEWORK = {
  VITE: "VITE",
  NEXTJS: "NEXTJS",
} as const;

export type ReactFramework =
  (typeof REACT_FRAMEWORK)[keyof typeof REACT_FRAMEWORK];

export const FRAMEWORK = {
  ...REACT_FRAMEWORK,
  EXPO: "EXPO",
} as const;

export type Framework = (typeof FRAMEWORK)[keyof typeof FRAMEWORK];

export const PLATFORM = {
  IOS: "ios",
  ANDROID: "android",
  ALL: "all",
} as const;

export type Platform = (typeof PLATFORM)[keyof typeof PLATFORM];
