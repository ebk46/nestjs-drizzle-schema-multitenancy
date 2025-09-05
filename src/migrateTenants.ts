import allTenants from './db/fixtures/allTenants';
import { migrateTenant } from './multitenancy/migrateTenant';

async function main() {
  const tenants = allTenants;

  await Promise.all(
    Object.keys(tenants).map(async (tenantId) => {
      const tenant = tenants[tenantId];
      console.log(`Migrating tenant: ${tenant.name}`);

      // Call the migration function for the tenant
      await migrateTenant(tenantId);
    }),
  );
}

void main();
