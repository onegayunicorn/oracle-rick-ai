/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        portal: {
          green: "#00FFAA",
          blue: "#44AAFF",
          orange: "#FF7A45",
          magenta: "#FF45E0",
        },
      },
      fontFamily: {
        telemetry: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        "glow-pulse": "glow 1.2s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
