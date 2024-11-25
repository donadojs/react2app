#!/usr/bin/env node
import { Command } from "commander";
import { dev } from "../src/commands/dev.js";
import { build } from "../src/commands/build.js";
import { deploy } from "../src/commands/deploy.js";

const program = new Command();

program
  .name("react2app")
  .description("CLI tool for React applications")
  .version("1.0.0");

program
  .command("dev [platform]")
  .description("Transform into app and start development server")
  .action(async (platform = "all", options) => {
    dev(platform, options);
  });

program.command("build").description("Build for production").action(build);
program.command("deploy").description("Deploy application").action(deploy);

program.parse();
