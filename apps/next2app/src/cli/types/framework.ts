import chalk from "chalk";

// Framework related types
export type FrameworkType = "nextjs" | "vite" | "expo";

export interface FrameworkConfig {
  name: FrameworkType;
  defaultPort: number;
  getDevCommand: (options: {
    host?: string;
    port?: number;
  }) => Promise<CommandConfig>;
  readyMessage: string;
  logPrefix: string;
  env?: Record<string, string>;
}

// Command related types
export interface CommandConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
  cwd?: string;
}

export type PackageManager = "npm" | "yarn" | "pnpm" | "auto";

// Server related types
export interface DevServerOptions {
  framework: FrameworkConfig;
  host?: string;
  port?: number;
  cwd?: string;
  logColor?: typeof chalk;
  debug?: boolean;
}

// next2app specific types
export interface N2ADevServerOptions {
  webServer: DevServerOptions;
  appServer: DevServerOptions;
}
