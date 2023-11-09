// tailwind config is required for editor support

import sharedConfig from "tailwind-config/tailwind.config.js";

export default {
  presets: [sharedConfig],
  prefix: "app-",
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
};
