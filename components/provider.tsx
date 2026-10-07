'use client';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Cart, User } from '@/lib/types';

export async function api<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to complete the request.');
  return data;
}
type ContextValue = {
  user: User | null;
  ready: boolean;
  cart: Cart | null;
  refresh: () => Promise<void>;
  refreshCart: () => Promise<void>;
  notify: (message: string) => void;
  add: (sku: string, cycle?: string, domain?: string) => Promise<void>;
};
const Context = createContext<ContextValue | null>(null);
export function Provider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [cart, setCart] = useState<Cart | null>(null),
    [ready, setReady] = useState(false),
    [toast, setToast] = useState('');
  const refreshCart = useCallback(async () => {
    const data = await api<Cart>('cart');
    setCart(data);
  }, []);
  const refresh = useCallback(async () => {
    try {
      const data = await api<{ user: User | null }>('auth/me');
      setUser(data.user);
    } finally {
      setReady(true);
    }
  }, []);
  useEffect(() => {
    void refresh().catch(() => {});
    void refreshCart().catch(() => {});
  }, [refresh, refreshCart]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(id);
  }, [toast]);
  const add = async (sku: string, cycle = 'monthly', domain = '') => {
    const data = await api<Cart>('cart', {
      method: 'POST',
      body: JSON.stringify({ sku, cycle, domain }),
    });
    setCart(data);
    setToast('Added to your cart. Your next chapter is taking shape.');
  };
  return (
    <Context.Provider value={{ user, ready, cart, refresh, refreshCart, notify: setToast, add }}>
      {children}
      {toast && (
        <div className="app-toast" role="status">
          <i aria-hidden="true" className="bi bi-check-circle-fill" />
          {toast}
          <button aria-label="Dismiss notification" onClick={() => setToast('')}>
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('Missing application provider');
  return value;
}
