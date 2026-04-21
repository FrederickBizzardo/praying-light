import { defineConfig, passthroughImageService } from 'astro/config';
import react from '@astrojs/react';

import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Enable React to support React JSX components.
  integrations: [react(), tailwind()],
  output: 'server',
  adapter: vercel({
    runtime: 'nodejs22.x'
  }),
  image: {
    service: passthroughImageService()
  }
});