import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { url } from './db-url';
import * as schema from './sharedSchema/tenants'; // index.ts that re-exports usersTable, etc.

const pool = new Pool({
  connectionString: url,
});

export const db = drizzle(pool, { schema });

@Module({
  providers: [
    {
      provide: 'DB',
      useValue: db,
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
