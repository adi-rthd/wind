import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outDir: "dist/esm",
    dts: true
  },
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    outDir: "dist/cjs",
    dts: false
  }
]);
