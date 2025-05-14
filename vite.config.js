import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss()
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8000"
    },
    host: "0.0.0.0", // Corrected the issue: provide the host as a string
    port: 5173
  }
});
