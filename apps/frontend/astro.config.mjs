// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import icon from "astro-icon";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    icon({
      iconDir: "public/icons",
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["axios"],
    },
    resolve: {
      alias: {
        "@": srcDir,
      },
    },
  },
});
