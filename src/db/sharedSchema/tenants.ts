import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tenantsTable = pgTable('tenants', {
  id: uuid().notNull().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull().unique(),
  schema: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});
