import fs from "fs-extra";

/**
 * Update the environment file. Add new variables if they don't exist and replace values if they do
 * @param envFilePath - The path of the environment file
 * @param environmentVariables - The environment variables to update
 */

export const updateEnvFile = async (
  envFilePath: string,
  environmentVariables: Record<string, string>
) => {
  const envFile = await fs.readFile(envFilePath, "utf-8");
  const updatedEnvFile = Object.entries(environmentVariables).reduce(
    (acc, [key, value]) => {
      if (acc.includes(key)) {
        return acc.replace(new RegExp(`${key}=.*`), `${key}=${value}`);
      }
      return acc + `${key}=${value}\n`;
    },
    envFile
  );
  fs.writeFileSync(envFilePath, updatedEnvFile);
};
