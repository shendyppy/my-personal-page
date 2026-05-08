// Flat config — required by ESLint 10 + eslint-config-next 16. The
// previous file used `FlatCompat` from `@eslint/eslintrc` to bridge the
// legacy "extends" syntax; that compatibility layer broke against the
// new eslint-config-next exports (circular structure during config
// validation). The native flat export from `eslint-config-next` works
// directly.
import nextConfig from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [
      "**/generated/**",
      "**/node_modules/**",
      ".next/**",
      "out/**",
    ],
  },
  ...nextConfig,
];

export default eslintConfig;
