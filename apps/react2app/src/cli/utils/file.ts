import fs from "fs-extra";
import path from "path";

export const copyFile = (
  filePathToCopy: string,
  targetDir: string,
  targetFilename: string
): string => {
  try {
    const templateFile = fs.readFileSync(filePathToCopy, "utf8");
    const newFilePath = path.join(targetDir, targetFilename);
    fs.writeFileSync(newFilePath, templateFile, "utf8");
    return newFilePath;
  } catch (error) {
    throw error;
  }
};
