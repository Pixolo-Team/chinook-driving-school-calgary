// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    icon({
      iconDir: "src/assets",
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": srcDir,
      },
    },
  },
});
