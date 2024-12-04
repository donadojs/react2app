import type {
  PackageManager,
  CommandConfig,
  DevServerOptions,
} from "./framework.js";

export interface CommandOptions {}

export interface DevCommandOptions {
  debug?: boolean;
  packageManager?: PackageManager;
  port?: number; // web server port
  host?: string; // web server host
}

export interface N2AConfig {
  name: string;
  ios: boolean;
  android: boolean;
}

export type { PackageManager, CommandConfig, DevServerOptions };
