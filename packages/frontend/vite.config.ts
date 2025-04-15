import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to the backend dev server
      "/api": {
        target: "http://localhost:8787", // Default wrangler dev port
        changeOrigin: true,
        secure: false,
        // Optional: rewrite path if needed, e.g., remove /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
