import rootConfig from "../prettier.config.mjs";

/** @type {import("prettier").Config} */
const prettierConfig = {
  ...rootConfig,
  plugins: ["prettier-plugin-tailwindcss"],
  // Ensure Tailwind class sorting also works inside helper functions (common with shadcn).
  tailwindFunctions: ["cn", "cva"],
};

export default prettierConfig;
