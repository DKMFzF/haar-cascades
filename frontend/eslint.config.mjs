import { createRequire } from "node:module";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";

const require = createRequire(import.meta.url);
const { layersLib } = require("@feature-sliced/eslint-config/utils/layers.js");

const LAYER_FOLDERS = {
  app: "_app",
  pages: "_pages",
  widgets: "widgets",
  features: "features",
  entities: "entities",
  shared: "shared",
};

const getLayerFolder = (layer) => LAYER_FOLDERS[layer] ?? layer;

const getNotSharedLayersRules = () =>
  layersLib.getUpperLayers("shared").map((layer) => ({
    from: layer,
    allow: layersLib.getLowerLayers(layer),
  }));

const getLayersBoundariesElements = () =>
  layersLib.FS_LAYERS.map((layer) => ({
    type: layer,
    pattern: `${getLayerFolder(layer)}/!(_*){,/*}`,
    mode: "folder",
    capture: ["slices"],
  }));

const getGodModeElements = () =>
  layersLib.FS_LAYERS.map((layer) => ({
    type: `gm_${layer}`,
    pattern: `${getLayerFolder(layer)}/_*`,
    mode: "folder",
    capture: ["slices"],
  }));

const getGodModeRules = () =>
  layersLib.FS_LAYERS.map((layer) => ({
    from: `gm_${layer}`,
    allow: [layer, ...layersLib.getLowerLayers(layer)],
  }));

const fsdImportOrderPathGroups = layersLib.FS_LAYERS.map((layer) => ({
  pattern: `**/?(*)${getLayerFolder(layer)}{,/**}`,
  group: "internal",
  position: "after",
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      boundaries,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      "boundaries/elements": [
        ...getLayersBoundariesElements(),
        ...getGodModeElements(),
      ],
    },
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: fsdImportOrderPathGroups,
          pathGroupsExcludedImportTypes: ["builtin"],
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          message:
            '"${file.type}" is not allowed to import "${dependency.type}" | See rules: https://feature-sliced.design/docs/reference/layers/overview ',
          rules: [
            ...getNotSharedLayersRules(),
            { from: "shared", allow: "shared" },
            { from: "app", allow: "app" },
            ...getGodModeRules(),
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
