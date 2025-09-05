import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private _tenantId: string;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get tenantId(): string {
    console.log('Request', this.request);
    if (!this._tenantId) {
      this._tenantId = this.request ? this.request.tenantId || '' : ''; // set by AuthGuard
    }
    console.log('TenantID', this._tenantId);
    return this._tenantId;
  }
}
