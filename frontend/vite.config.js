import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://admin.kikperfume.com",
        changeOrigin: true,  // recommended for cross-origin
        secure: true,        // if using HTTPS
      },
    },
  },
});
