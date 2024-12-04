#!/usr/bin/env node
import { Command } from "commander";
import { dev } from "../src/cli/commands/dev.js";
import { build } from "../src/cli/commands/build.js";
import { deploy } from "../src/cli/commands/deploy.js";
import { clean } from "../src/cli/commands/clean.js";
import { doctor } from "../src/cli/commands/doctor.js";
import { DevCommandOptions } from "../src/cli/types/index.js";
import { init } from "../src/cli/commands/init.js";

const program = new Command();

program
  .name("next2app")
  .description("CLI tool for React applications")
  .version("1.0.0");

program
  .command("dev [platform]")
  .description("Transform into app and start development server")
  .option("-d, --debug", "Show detailed dev server logs for debugging")
  .option("-H, --host <host>", "Web server host")
  .option("-p, --port <port>", "Web server port")
  .action(async (platform = "all", options: DevCommandOptions) => {
    dev(platform, options);
  });

program.command("build").description("Build for production").action(build);
program.command("deploy").description("Deploy application").action(deploy);
program.command("doctor").description("Check for issues").action(doctor);
program.command("clean").description("Clean up").action(clean);
program.command("init").description("Initialize project").action(init);

program.parse();
