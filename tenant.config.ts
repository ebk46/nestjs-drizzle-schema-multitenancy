import { url as dbUrl } from 'src/db/db-url';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/tenant',
  schema: ['./src/db/tenantSchema/*.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  migrations: {
    table: '__drizzle_tenant_migrations',
    schema: '__tenant',
  },
  schemaFilter: ['__tenant'],
});
