import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { safeQuery } from '../../db/safeQuery';
import { tenantsTable } from '../../db/sharedSchema/tenants';

@Injectable()
export class TenantsService {
  constructor(@Inject('DB') private db: NodePgDatabase) {}

  // SECURITY: You should likely never publicly expose the full list of tenants in a production app
  async findAll() {
    return safeQuery(async () => {
      return await this.db.select().from(tenantsTable);
    });
  }
}
