const { FlatCompat } = require("@eslint/eslintrc");
const path = require("path");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: path.join(__dirname, "node_modules"),
});

module.exports = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];