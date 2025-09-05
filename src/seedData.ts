import { getUsersTable } from './db/tenantSchema/users';
import { db } from './db/database.module';
import allTenants from './db/fixtures/allTenants';
import { tenantsTable } from './db/sharedSchema/tenants';
import seedUsers from './db/fixtures/seedUsers';
import { safeQuery } from './db/safeQuery';

async function main() {
  // Create tenants
  for (const tenantIdx of Object.keys(allTenants)) {
    await safeQuery(() =>
      db
        .insert(tenantsTable)
        .values({
          name: allTenants[tenantIdx].name,
          schema: allTenants[tenantIdx].schemaName,
        })
        .onConflictDoUpdate({
          target: tenantsTable.schema,
          set: { name: allTenants[tenantIdx].name },
        })
        .execute(),
    );
  }

  console.log('Tenants updated.');

  // Create some test users in each tenant
  for (const tenantIdx of Object.keys(allTenants)) {
    const tenantId = allTenants[tenantIdx].schemaName;
    const usersTable = getUsersTable(tenantId);
    for (const user of seedUsers[tenantId]) {
      await safeQuery(() =>
        db
          .insert(usersTable)
          .values({
            name: user.name,
            email: user.email,
          })
          .onConflictDoUpdate({
            target: usersTable.email,
            set: { name: user.name },
          })
          .execute(),
      );
    }
  }

  console.log('Users updated.');
}
void main();
