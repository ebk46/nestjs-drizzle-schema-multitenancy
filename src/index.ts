import { drizzle } from 'drizzle-orm/node-postgres';
import { url } from './db/db-url';
import { eq } from 'drizzle-orm';
import { getUsersTable } from './db/tenantSchema/users';
import allTenants from './db/fixtures/allTenants';

const db = drizzle(url);

async function main() {
  const testTenant = Object.values(allTenants)[0]
  const usersTable = getUsersTable(testTenant.schemaName);
  const testUser = {
    name: 'John',
    email: `john@${testTenant.domain}`,
  };
  db.insert(usersTable).values(testUser);
  console.log('New user created!');
  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);
  /*
  const users: {
    id: number;
    name: string;
    email: string;
  }[]
  */
  await db
    .update(usersTable)
    .set({
      email: `john.doe@${testTenant.domain}`,
    })
    .where(eq(usersTable.email, testUser.email));
  console.log('User info updated!');
  await db.delete(usersTable).where(eq(usersTable.email, testUser.email));
  console.log('User deleted!');
}
void main();
