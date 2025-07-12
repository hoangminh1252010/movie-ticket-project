/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // File HTML gốc
    "./node_modules/flowbite/**/*.js", // Thư viện Flowbite
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
