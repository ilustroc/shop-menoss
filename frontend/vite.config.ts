import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  test: {
    // Simula el navegador
    environment: "jsdom",

    // Configuracion test
    setupFiles: "./src/test/setup.ts",

    globals: true,
  },
});
