import { Injectable, Inject, Scope } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { getUsersTable } from '../../db/tenantSchema/users';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto } from './dto/create-user.dto';
import { safeQuery } from '../../db/safeQuery';
import type { Request } from 'express';
//import { TenantContextService } from '../../modules/tenant-context/tenant-context.service';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class UsersService {
  users: ReturnType<typeof getUsersTable>;

  constructor(
    @Inject('DB') private db: NodePgDatabase,
    @Inject('REQUEST') private request: Request,
    //private readonly tenant: TenantContextService,
  ) {
    // Durable strategy - initialize once per request
    const tenantId = this.request.tenantId;
    if (!tenantId) throw new Error('No tenantId set on request');
    this.users = getUsersTable(tenantId);
  }

  // Per-request strategy - initialize on access
  // private get users() {
  //   console.log(this.request);
  //   if (!this._users) {
  //     const tenantId = this.tenant.tenantId;
  //     if (!tenantId) throw new Error('No tenantId set on request');
  //     this._users = getUsersTable(tenantId);
  //   }
  //   return this._users;
  // }

  async findAll() {
    return this.db.select().from(this.users);
  }

  async findOne(id: number) {
    return safeQuery(async () => {
      const [user] = await this.db
        .select()
        .from(this.users)
        .where(eq(this.users.id, id));
      return user ?? null;
    });
  }

  async create(dto: CreateUserDto) {
    return safeQuery(async () => {
      const [row] = await this.db
        .insert(this.users)
        .values({ name: dto.name, email: dto.email })
        .returning();
      return row;
    });
  }
}
