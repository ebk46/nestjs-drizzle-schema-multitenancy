import { serial, pgSchema, varchar } from 'drizzle-orm/pg-core';
import { TENANT_SCHEMA_PLACEHOLDER } from '../../multitenancy/constants';

const buildUsersTable = (tenantId: string) =>
  pgSchema(tenantId).table('users', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
  });

const usersTableCache = new Map<string, ReturnType<typeof buildUsersTable>>();

// Retrieves the users table for a specific tenant.
export const getUsersTable = (tenantId: string) => {
  let usersTable = usersTableCache.get(tenantId);
  if (!usersTable) {
    usersTable = buildUsersTable(tenantId);
    usersTableCache.set(tenantId, usersTable);
  }
  return usersTable;
};

// Expose the users table for migration across each tenant using the placeholder tenant key
export const _usersTablePlaceholder = getUsersTable(TENANT_SCHEMA_PLACEHOLDER);
