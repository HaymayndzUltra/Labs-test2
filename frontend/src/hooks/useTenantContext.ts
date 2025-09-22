'use client';

import { useCallback, useEffect, useState } from 'react';

export function useTenantContext() {
  const [tenantId, setTenantIdState] = useState<string | null>(null);
  const [tenantRole, setTenantRoleState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setTenantIdState(localStorage.getItem('active_tenant_id'));
    setTenantRoleState(localStorage.getItem('tenant_role'));
  }, []);

  const setTenantId = useCallback((id: string | null) => {
    if (typeof window === 'undefined') return;
    if (id) {
      localStorage.setItem('active_tenant_id', id);
    } else {
      localStorage.removeItem('active_tenant_id');
    }
    setTenantIdState(id);
  }, []);

  const setTenantRole = useCallback((role: string | null) => {
    if (typeof window === 'undefined') return;
    if (role) {
      localStorage.setItem('tenant_role', role);
    } else {
      localStorage.removeItem('tenant_role');
    }
    setTenantRoleState(role);
  }, []);

  return {
    tenantId,
    tenantRole,
    setTenantId,
    setTenantRole,
    isAdmin: tenantRole === 'admin',
  };
}
