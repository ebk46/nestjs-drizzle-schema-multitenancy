import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { TenantContextModule } from './modules/tenant-context/tenant-context.module';

@Module({
  imports: [TenantContextModule, TenantsModule, UsersModule],
  controllers: [AppController],
  // Guard all routes with auth by default, can override with @Public() decorator on controllers or routes
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AppService],
})
export class AppModule {}
