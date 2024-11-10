import inquirer from "inquirer";
import { logger } from "../utils/logger.js";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export const deploy = async () => {
  try {
    // Verify we're in a React project
    const cwd = process.cwd();
    if (!fs.existsSync(path.join(cwd, "package.json"))) {
      logger.error(
        "No package.json found. Please run this command in your project root directory."
      );
      process.exit(1);
    }

    // Check if build directory exists
    const buildExists =
      fs.existsSync(path.join(cwd, "build")) ||
      fs.existsSync(path.join(cwd, "dist"));

    if (!buildExists) {
      logger.error("No build directory found. Running build command first...");
      const buildCommand = "react2app build";
      execSync(buildCommand, { stdio: "inherit", cwd });
    }

    const { platform } = await inquirer.prompt([
      {
        type: "list",
        name: "platform",
        message: "Select your deployment platform:",
        choices: [
          { name: "Vercel", value: "vercel" },
          { name: "Netlify", value: "netlify" },
          { name: "GitHub Pages", value: "github" },
          { name: "AWS S3", value: "aws" },
          { name: "Firebase", value: "firebase" },
        ],
      },
    ]);

    switch (platform) {
      case "vercel":
        logger.info("Deploying to Vercel...");
        logger.info("1. Install Vercel CLI: npm i -g vercel");
        logger.info("2. Run: vercel login");
        logger.info("3. Deploy with: vercel");
        break;

      case "netlify":
        logger.info("Deploying to Netlify...");
        logger.info("1. Install Netlify CLI: npm i -g netlify-cli");
        logger.info("2. Run: netlify login");
        logger.info("3. Deploy with: netlify deploy");
        break;

      case "github":
        logger.info("Deploying to GitHub Pages...");
        logger.info(
          '1. Add "homepage" field to package.json: "https://username.github.io/repo-name"'
        );
        logger.info("2. Install gh-pages: npm install --save-dev gh-pages");
        logger.info('3. Add deploy script: "deploy": "gh-pages -d build"');
        logger.info("4. Run: npm run deploy");
        break;

      case "aws":
        logger.info("Deploying to AWS S3...");
        logger.info("1. Install AWS CLI and configure credentials");
        logger.info("2. Create S3 bucket and enable static website hosting");
        logger.info("3. Deploy with: aws s3 sync build/ s3://your-bucket-name");
        break;

      case "firebase":
        logger.info("Deploying to Firebase...");
        logger.info("1. Install Firebase CLI: npm install -g firebase-tools");
        logger.info("2. Run: firebase login");
        logger.info("3. Initialize: firebase init hosting");
        logger.info("4. Deploy with: firebase deploy");
        break;
    }

    logger.success("Deployment instructions provided!");
    logger.info("Follow the steps above to complete your deployment.");
  } catch (error) {
    logger.error(
      "Deployment preparation failed: " +
        (error instanceof Error ? error.message : String(error))
    );
    process.exit(1);
  }
};
