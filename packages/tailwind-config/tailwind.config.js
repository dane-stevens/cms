const colors = require("tailwindcss/colors");
const Color = require("color");

const alpha = (clr, val) => Color(clr).alpha(val).rgb().string();
const lighen = (clr, val) => Color(clr).lighten(val).rgb().string();
const darken = (clr, val) => Color(clr).darken(val).rgb().string();

export default {
  content: [
    // "./app/**/*.{js,jsx,ts,tsx}",
    `src/**/*.{js,ts,jsx,tsx}`,
    // "../../packages/**/*.{js,ts,jsx,tsx}",
    // "../../app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      red: colors.red,
      blue: colors.blue,
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      slate: colors.slate,
      yellow: colors.yellow,
      green: colors.green,
      purple: colors.purple,
      pink: colors.pink,
      amber: colors.amber,
      zinc: colors.zinc,
      fuchsia: colors.fuchsia,
    },
    extend: {
      fontFamily: {
        body: "sans-serif",
      },
      fontSize: {
        xxs: "0.6rem",
      },
      boxShadow: {
        card: `0 1px 1px 0 rgb(0 0 0 / 0.1),
        0 1px 3px 1px rgb(0 0 0 / 0.1)`,
      },
      colors: {
        primary: colors.blue[600],
        primaryDark: darken(colors.blue[600], 0.3),
      },
    },
  },
  plugins: [],
};
