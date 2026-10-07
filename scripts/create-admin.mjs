import { randomUUID } from 'node:crypto';
import { database } from '../lib/database.mjs';
import { hashPassword } from '../lib/security.mjs';
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  console.error(
    'Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) securely in your shell. No default administrator password is provided.',
  );
  process.exit(1);
}
const db = database();
const existing = db.prepare('SELECT id FROM users WHERE email=?').get(email);
if (existing) {
  console.error(
    'An account with that email already exists. This command does not overwrite accounts or elevate existing users.',
  );
  process.exit(1);
}
db.prepare('INSERT INTO users(id,name,email,password_hash,role) VALUES(?,?,?,?,?)').run(
  randomUUID(),
  process.env.ADMIN_NAME || 'Veehoster Admin',
  email,
  await hashPassword(password),
  'admin',
);
console.log('Administrator created. Sign in using the normal login page.');
