import { sql } from 'drizzle-orm';
import getMigrationsForTenant from './getMigrationsForTenant';
import { QueryResult } from 'pg';
import { db } from '../db/database.module';

export async function migrateTenant(tenant: string) {
  const migrations = getMigrationsForTenant(tenant);

  const migrationsTable = '__drizzle_tenant_migrations';
  const migrationsSchema = tenant;

  const migrationTableCreate = sql`
    CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;

  await db.execute(
    sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(migrationsSchema)}`,
  );

  await db.execute(migrationTableCreate);

  type Migration = { id: number; hash: string; created_at: string };

  const dbMigrations: QueryResult<Migration> = await db.execute(sql<Migration>`
    select id, hash, created_at
    from ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)}
    order by created_at desc
    limit 1
  `);

  const lastDbMigration = dbMigrations.rows[0];

  await db.transaction(async (tx) => {
    for (const migration of migrations) {
      if (
        !lastDbMigration ||
        Number(lastDbMigration.created_at) < migration.folderMillis
      ) {
        for (const stmt of migration.sql) {
          await tx.execute(sql.raw(stmt));
        }

        await tx.execute(
          sql`
            insert into ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} 
            ("hash", "created_at") 
            values (${migration.hash}, ${migration.folderMillis})
          `,
        );
      }
    }
  });
}
