// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }
  }
});
