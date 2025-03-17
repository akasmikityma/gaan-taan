// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Allow unused variables
      "@typescript-eslint/ban-ts-comment": "off", // Allow @ts-ignore
      "@typescript-eslint/no-explicit-any": "off", // Allow usage of `any`
      "react-hooks/exhaustive-deps": "off", // Disable exhaustive-deps warning
      "@next/next/no-img-element": "off", // Allow <img> instead of Next.js Image component
      "jsx-a11y/alt-text": "off", // Disable alt attribute warnings
      "prefer-const": "off", // Allow let instead of forcing const
      "no-console": "off", // Allow console logs
    },
  },
];

export default eslintConfig;
