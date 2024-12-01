export const convertPackageNameToProjectName = (packageName: string) => {
  return packageName
    .replace(/^@.*\//, "") // Remove scope if exists
    .replace(/-/g, "_"); // Replace '-' with '_'
};

export const convertPackageNameToDisplayName = (packageName: string) => {
  return packageName
    .replace(/\b\w/g, (char: string) => char.toUpperCase()) // Capitalize first letter of each word
    .replace(/^@.*\//, "") // Remove scope if exists
    .replace(/-/g, " "); // Replace '-' with space
};

export const convertPackageNameToAppId = (packageName: string) => {
  return `com.${
    packageName
      .toLowerCase() // Convert to lowercase
      .replace(/^@.*\//, "") // Remove scope if exists
      .replace(/[^a-z0-9]/g, "") // Remove any characters that aren't alphanumeric
      .replace(/^[0-9]/, "x$&") // Prefix with 'x' if starts with number
  }.app`;
};
