import type { FrameworkType, FrameworkConfig } from "../types/framework.js";

const DEFAULT_HOST = "localhost";
const MIN_SAFE_PORT = 1024;
const DEFAULT_PORTS = {
  NEXT: 3000,
  VITE: 5173,
  EXPO: 8081,
} as const;

export const frameworks: Record<FrameworkType, FrameworkConfig> = {
  nextjs: {
    name: "nextjs",
    defaultPort: DEFAULT_PORTS.NEXT,
    readyMessage: "✓ Ready",
    logPrefix: "[Web]",
    async getDevCommand(options) {
      const host = options.host || DEFAULT_HOST;
      const port = options.port || this.defaultPort;

      return {
        command: "npx",
        args: ["next", "dev", "-H", host],
        env: {
          PORT: port.toString(),
        },
      };
    },
  },
  vite: {
    name: "vite",
    defaultPort: DEFAULT_PORTS.VITE,
    readyMessage: "ready in",
    logPrefix: "[Web]",
    async getDevCommand(options) {
      const host = options.host || DEFAULT_HOST;
      const port = options.port || this.defaultPort;

      return {
        command: "npx",
        args: ["vite"],
        env: {
          PORT: port.toString(),
          HOST: host,
        },
      };
    },
  },
  expo: {
    name: "expo",
    defaultPort: DEFAULT_PORTS.EXPO,
    readyMessage: "Logs for your project will appear below",
    logPrefix: "[App]",
    async getDevCommand(options) {
      const port = options.port || this.defaultPort;

      return {
        command: "npx",
        args: ["expo", "start", "--port", port.toString()],
      };
    },
  },
};
