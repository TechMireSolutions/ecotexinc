import './setup';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { useStore } from '../src/store/useStore';

describe('Frontend Admin Authentication & Route Protection Logic', () => {
  beforeEach(() => {
    useStore.getState().logout();
  });

  it('should start with unauthenticated state after logout()', () => {
    const state = useStore.getState();
    assert.equal(state.isAuthenticated, false);
    assert.equal(state.adminToken, null);
    assert.equal(state.adminUser, null);
  });

  it('should reject invalid login credentials with clear error message', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({
        success: false,
        message: 'Access Denied: Invalid administrator credentials.'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    };

    try {
      const res = await useStore.getState().login('wrong@email.com', 'wrongpassword');
      assert.equal(res.success, false);
      assert.ok(res.error);
      assert.equal(useStore.getState().isAuthenticated, false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should authenticate successfully with valid server JWT response', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({
        success: true,
        token: 'test-jwt-admin-token-2026',
        user: { name: 'Executive Director', email: 'admin@ecotexinc.com', role: 'Super Admin' }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    };

    try {
      const res = await useStore.getState().login('admin@ecotexinc.com', 'admin');
      assert.equal(res.success, true);
      
      const state = useStore.getState();
      assert.equal(state.isAuthenticated, true);
      assert.equal(state.adminToken, 'test-jwt-admin-token-2026');
      assert.equal(state.adminUser?.email, 'admin@ecotexinc.com');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should clear authentication state on logout', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({
        success: true,
        token: 'test-jwt-admin-token-2026',
        user: { name: 'Executive Director', email: 'admin@ecotexinc.com', role: 'Super Admin' }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    };

    try {
      await useStore.getState().login('admin@ecotexinc.com', 'admin');
      assert.equal(useStore.getState().isAuthenticated, true);

      useStore.getState().logout();
      assert.equal(useStore.getState().isAuthenticated, false);
      assert.equal(useStore.getState().adminToken, null);
      assert.equal(useStore.getState().adminUser, null);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
