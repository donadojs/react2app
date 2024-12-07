import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: "src",
    entryFileNames: "[name].js",
    sourcemap: true,
    banner: (chunk) => {
      if (chunk.fileName.includes("StackNavigation")) {
        return '"use client";\n';
      }
      return "";
    },
  },
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "next",
    "next/navigation",
  ],
  plugins: [
    postcss({
      plugins: [tailwindcss("./tailwind.config.js"), autoprefixer()],
      extract: "styles.css",
      modules: true,
      autoModules: true,
      minimize: true,
    }),
    resolve({
      browser: true,
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      preferBuiltins: false,
    }),
    commonjs({
      requireReturnsDefault: "auto",
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: true,
      declaration: true,
      declarationMap: true,
      declarationDir: "./dist/types",
      exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"],
      rootDir: "src",
      moduleResolution: "bundler",
      jsx: "react-jsx",
    }),
  ],
};
