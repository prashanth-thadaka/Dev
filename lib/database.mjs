import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

let connection;
export function database() {
  if (connection) return connection;
  const filename = path.resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH || './data/veehoster.sqlite',
  );
  mkdirSync(path.dirname(filename), { recursive: true });
  connection = new DatabaseSync(filename);
  connection.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')), phone TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS resets (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS cart_items (id TEXT PRIMARY KEY, cart_id TEXT NOT NULL, sku TEXT NOT NULL, domain TEXT NOT NULL DEFAULT '', cycle TEXT NOT NULL DEFAULT 'monthly', quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity BETWEEN 1 AND 10));
    CREATE INDEX IF NOT EXISTS cart_lookup ON cart_items(cart_id);
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), checkout_key TEXT NOT NULL UNIQUE, cart_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', subtotal INTEGER NOT NULL, tax INTEGER NOT NULL, total INTEGER NOT NULL, items TEXT NOT NULL, billing TEXT NOT NULL, payment_mode TEXT NOT NULL, gateway_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, paid_at TEXT);
    CREATE INDEX IF NOT EXISTS order_owner ON orders(user_id);
    CREATE TABLE IF NOT EXISTS inquiries (id TEXT PRIMARY KEY, kind TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '', message TEXT NOT NULL, details TEXT NOT NULL DEFAULT '{}', status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), subject TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', messages TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS audit_events (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, action TEXT NOT NULL, target_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  `);
  return connection;
}
/** @template T @param {(db: DatabaseSync) => T} fn @returns {T} */
export function transaction(fn) {
  const db = database();
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn(db);
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
