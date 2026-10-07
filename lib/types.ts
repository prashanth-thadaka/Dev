export type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
};
export type CartItem = {
  id: string;
  sku: string;
  name: string;
  domain: string;
  cycle: string;
  quantity: number;
  unitPrice: number;
  total: number;
  period: string;
};
export type Cart = {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  demo: boolean;
  mode: string;
};
export type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  items: string;
  created_at: string;
  payment_mode: string;
  customer_name?: string;
  customer_email?: string;
};
