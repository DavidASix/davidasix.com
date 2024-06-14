/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/assets/constants.js",
  ],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
      colors: {
        da: {
          dark: {
            50: "#f6f6f6",
            100: "#e7e7e7",
            200: "#d1d1d1",
            300: "#b0b0b0",
            400: "#888888",
            500: "#6d6d6d",
            600: "#5d5d5d",
            700: "#4f4f4f",
            800: "#454545",
            900: "#3d3d3d",
            DEFAULT: "#1a1a1a",
            950: "#1a1a1a",
          },
          primary: {
            50: "#f8f3ff",
            100: "#f1e9fe",
            200: "#e6d6fe",
            300: "#d1b5fd",
            400: "#b68bfa",
            500: "#985cf6",
            600: "#803aed",
            DEFAULT: "#6d28d9",
            700: "#6d28d9",
            800: "#5b21b6",
            900: "#4c1d95",
            950: "#311065",
          },
          secondary: {
            50: "#efeeff",
            100: "#e2e0ff",
            200: "#cac7fe",
            300: "#aaa5fc",
            400: "#8881f8",
            500: "#6b63f1",
            DEFAULT: "#4f46e5",
            600: "#4f46e5",
            700: "#4038ca",
            800: "#3730a3",
            900: "#332e81",
            950: "#1e1b4b",
          },
          accent: {
            50: "#fffaeb",
            100: "#fef1c7",
            200: "#fde28a",
            DEFAULT: "#fcd34d",
            300: "#fcd34d",
            400: "#fbc924",
            500: "#f5be0b",
            600: "#d9a806",
            700: "#b48c09",
            800: "#92730e",
            900: "#785f0f",
            950: "#453603",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#6d28d9",
          secondary: "#4f46e5",
          accent: "#fcd34d",
          neutral: "#272727",
          "base-100": "#1a1a1a",
          info: "#fb923c",
          success: "#84cc16",
          warning: "#f87171",
          error: "#ef4444",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
