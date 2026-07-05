import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ["**/.gitkeep"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
  {
    // Next.js App Router: FSD layers are prefixed to avoid conflicts with Next.js folders.
    files: ["./src/_app/**", "./src/_pages/**"],
    rules: {
      "fsd/typo-in-layer-name": "off",
    },
  },
  {
    // The app layer is unsliced, but steiger treats `_app` as sliced because of the prefix.
    files: ["./src/_app/**"],
    rules: {
      "fsd/no-segmentless-slices": "off",
    },
  },
]);
