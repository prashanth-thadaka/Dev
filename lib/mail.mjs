import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
export const mailConfigured = () =>
  Boolean(
    process.env.MAIL_API_KEY &&
    process.env.MAIL_FROM &&
    process.env.APP_URL?.startsWith('https://'),
  );
export async function sendResetEmail(email, resetToken) {
  const url = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  if (mailConfigured()) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [email],
        subject: 'Reset your Veehoster password',
        text: `Reset your password using this link: ${url}\n\nThis link expires in 30 minutes. If you did not request a reset, you can ignore this message.`,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      throw new Error('Password reset email could not be delivered. Please try again later.');
    return;
  }
  if (process.env.NODE_ENV === 'production')
    throw new Error('Password recovery email is not configured.');
  const directory = path.dirname(
    path.resolve(
      /* turbopackIgnore: true */ process.env.DATABASE_PATH || './data/veehoster.sqlite',
    ),
  );
  mkdirSync(directory, { recursive: true });
  appendFileSync(
    path.join(directory, 'mailbox.jsonl'),
    JSON.stringify({
      to: email,
      subject: 'Reset your Veehoster password',
      url,
      createdAt: new Date().toISOString(),
    }) + '\n',
    { mode: 0o600 },
  );
}
