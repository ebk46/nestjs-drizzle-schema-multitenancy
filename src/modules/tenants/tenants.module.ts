import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
