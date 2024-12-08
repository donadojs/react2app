import fs from "fs/promises";
import { PATHS } from "./path.js";

export const addAppLayout = async () => {
  const layoutPath = PATHS.NEXTJS.LAYOUT_FILE;
  const layoutContent = await fs.readFile(layoutPath, "utf8");

  if (layoutContent.includes("<AppLayout>")) {
    return;
  }

  const newLayoutContent = layoutContent.replace(
    /(<body[^>]*>)([\s\S]*?)(\{children\})([\s\S]*?)(<\/body>)/,
    "$1$2<AppLayout>{children}</AppLayout>$4$5"
  );

  await fs.writeFile(layoutPath, newLayoutContent);
};

export const removeAppLayout = async () => {
  const layoutPath = PATHS.NEXTJS.LAYOUT_FILE;
  const layoutContent = await fs.readFile(layoutPath, "utf8");

  const newLayoutContent = layoutContent.replace(
    /(<body[^>]*>)([\s\S]*?)<AppLayout>([\s\S]*?)<\/AppLayout>([\s\S]*?)(<\/body>)/,
    "$1$2$3$4$5"
  );

  await fs.writeFile(layoutPath, newLayoutContent);
};
