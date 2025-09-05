import { Request } from 'express';
import {
  HostComponentInfo,
  ContextId,
  ContextIdFactory,
  ContextIdStrategy,
} from '@nestjs/core';

const tenants = new Map<string, ContextId>();

// Build a durable DI (dependency injection) tree for each tenant
export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
  attach(contextId: ContextId, request: Request) {
    // SECURITY: This should be a more robust check, not just trusting a header.
    // The best candidate is using something like a JWT field, in which case the actual
    // connection identifier could be used rather than doing an extra DB lookup.
    // If needed, auth can always be used to validate (i.e. authenticate against tenant-users)
    const tenantId = request.headers['x-tenant-id'] as string;
    let tenantSubTreeId = tenants.get(tenantId);

    if (!tenantSubTreeId) {
      tenantSubTreeId = ContextIdFactory.create();
      tenants.set(tenantId, tenantSubTreeId);
    }

    // If tree is not durable, return the original "contextId" object
    return {
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? tenantSubTreeId : contextId,
      payload: { tenantId },
    };
  }
}
