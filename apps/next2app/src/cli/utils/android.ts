import inquirer from "inquirer";
import fs from "fs-extra";
import { FILE_NAMES } from "../config/constants.js";
import { PATHS } from "./path.js";
import { runSpawn } from "./program.js";
import dotenv from "dotenv";
import { homedir } from "os";
import path from "path";

export const generateKeyStore = async (options: {
  keyStorePath: string;
  keyAlias: string;
  keyStorePassword: string;
  keyPassword: string;
}) => {
  console.log(options);
  try {
    await runSpawn("keytool", [
      "-genkey",
      "-v",
      "-keystore",
      options.keyStorePath,
      "-alias",
      options.keyAlias,
      "-keyalg",
      "RSA",
      "-keysize",
      "2048",
      "-validity",
      "10000",
      "-dname",
      `CN=Next2App, OU=Next2App, O=Next2App, L=Next2App, ST=Next2App, C=US`,
      "-storepass",
      options.keyStorePassword,
      "-keypass",
      options.keyPassword,
    ]);
  } catch (e) {
    console.error(e);
    throw e;
  }
  return {
    keyStorePath: options.keyStorePath,
    keyStorePassword: options.keyStorePassword,
    keyAlias: options.keyAlias,
    keyPassword: options.keyPassword,
  };
};

// Key Store
export const ensureN2AKeyStore = async () => {
  const { default: N2AConfig } = await import(PATHS.N2A.CONFIG_FILE);
  const isKeyStoreExist = await fs.existsSync(
    N2AConfig.android.keyStore.keystorePath
  );

  // If key store does not exist, generate it
  if (!isKeyStoreExist) {
    const { password } = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        message:
          '💬 KeyStore/Key Password\n\nTo upload your app to the Play Store, you need a signed .aab! (build output)\nThink of this like your personal signature on build file saying\n"Yes, this is my app and I approve this release."\n\nPlease type the new password (at least 6 characters):',
        validate: (input: string) => {
          if (input.length < 6) {
            return "Password must be at least 6 characters long";
          }
          return true;
        },
      },
    ]);

    const keyStore = await generateKeyStore({
      keyStorePath: PATHS.ANDROID.KEYSTORE,
      keyStorePassword: password,
      keyAlias: FILE_NAMES.ANDROID.KEY_ALIAS,
      keyPassword: password,
    });
    return keyStore;
  }

  // If key store exists but password is not set, prompt user to set the password
  dotenv.config();
  const { parsed: N2AEnvFile } = dotenv.config({ path: PATHS.NEXTJS.ENV_FILE });
  const isPasswordSet =
    N2AEnvFile?.N2A_ANDROID_KEYSTORE_PASSWORD &&
    N2AEnvFile?.N2A_ANDROID_KEY_PASSWORD;

  if (!isPasswordSet) {
    throw new Error(
      "Key store already exists but password is not set, please set the keystore password and key password in the config file correctly"
    );
  }

  return {
    keyStorePath: path.resolve(N2AConfig.android.keyStore.keystorePath),
    keyStorePassword: N2AEnvFile.N2A_ANDROID_KEYSTORE_PASSWORD,
    keyAlias: N2AConfig.android.keyStore.keyAlias,
    keyPassword: N2AEnvFile.N2A_ANDROID_KEY_PASSWORD,
  };
};

export const setSDKLocation = async (androidRoot: string) => {
  try {
    const sdkPath = `sdk.dir=${homedir()}/Library/Android/sdk`;
    await fs.writeFile(path.join(androidRoot, "local.properties"), sdkPath);
  } catch (error) {
    console.error("Error creating local.properties:", error);
    throw error;
  }
};
