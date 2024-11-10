#!/usr/bin/env node
import { Command } from "commander";
import { dev } from "../src/commands/dev";
import { build } from "../src/commands/build";
import { deploy } from "../src/commands/deploy";
const program = new Command();
program
    .name("react2app")
    .description("CLI tool for React applications")
    .version("1.0.0");
program.command("dev").description("Start development server").action(dev);
program.command("build").description("Build for production").action(build);
program.command("deploy").description("Deploy application").action(deploy);
program.parse();
