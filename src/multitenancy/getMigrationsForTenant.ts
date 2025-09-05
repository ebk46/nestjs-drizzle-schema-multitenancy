import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import {
  DRIZZLE_STATEMENT_BREAKPOINT,
  TENANT_SCHEMA_PLACEHOLDER,
} from './constants';

// Define the MigrationMeta type
type MigrationMeta = {
  sql: string[];
  bps: boolean;
  folderMillis: number;
  hash: string;
};

export function getMigrationsForTenant(tenant: string): MigrationMeta[] {
  const migrationFolderTo = path.join(__dirname, '../../../drizzle/tenant');

  const migrationQueries: MigrationMeta[] = [];

  const journalPath = path.join(migrationFolderTo, 'meta/_journal.json');

  if (!fs.existsSync(journalPath)) {
    throw new Error(`Journal file not found at ${journalPath}`);
  }

  const journal = JSON.parse(fs.readFileSync(journalPath).toString()) as {
    entries: {
      idx: number;
      when: number;
      tag: string;
      breakpoints: boolean;
    }[];
  };

  for (const journalEntry of journal.entries) {
    const migrationPath = path.join(
      migrationFolderTo,
      `${journalEntry.tag}.sql`,
    );

    try {
      const query = fs.readFileSync(migrationPath).toString();

      const res = query.split(DRIZZLE_STATEMENT_BREAKPOINT).map((it) => {
        const i = it.replaceAll(TENANT_SCHEMA_PLACEHOLDER, tenant);
        return i;
      });

      migrationQueries.push({
        sql: res,
        bps: journalEntry.breakpoints,
        folderMillis: journalEntry.when,
        hash: createHash('sha256').update(query).digest('hex'),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error(`No file ${migrationPath} found in ${migrationFolderTo}`);
    }
  }

  return migrationQueries;
}

export default getMigrationsForTenant;
