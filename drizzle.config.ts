import { url } from './src/db/db-url';

import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle/shared',
  schema: './src/db/sharedSchema/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: url,
  },
});
