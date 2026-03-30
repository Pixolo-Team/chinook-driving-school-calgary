// @ts-check
import { defineConfig } from 'astro/config';
import icon from "astro-icon";

import tailwindcss from '@tailwindcss/vite';

import path from 'path';

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      iconDir: "src/assets",
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  }
});