import { createHash, timingSafeEqual } from 'node:crypto';
export const sha512 = (value) => createHash('sha512').update(value).digest('hex');
// PayU Hosted Checkout, SHA-512 sequence. Never run this in the browser.
export function requestHash(fields, salt) {
  return sha512(
    [
      fields.key,
      fields.txnid,
      fields.amount,
      fields.productinfo,
      fields.firstname,
      fields.email,
      fields.udf1 || '',
      fields.udf2 || '',
      fields.udf3 || '',
      fields.udf4 || '',
      fields.udf5 || '',
      '',
      '',
      '',
      '',
      '',
      salt,
    ].join('|'),
  );
}
export function responseHash(fields, salt) {
  const base = [
    salt,
    fields.status,
    '',
    '',
    '',
    '',
    '',
    fields.udf5 || '',
    fields.udf4 || '',
    fields.udf3 || '',
    fields.udf2 || '',
    fields.udf1 || '',
    fields.email,
    fields.firstname,
    fields.productinfo,
    fields.amount,
    fields.txnid,
    fields.key,
  ].join('|');
  return sha512(fields.additionalCharges ? `${fields.additionalCharges}|${base}` : base);
}
export function validResponseHash(fields, salt) {
  if (typeof fields.hash !== 'string' || !/^[a-f0-9]{128}$/i.test(fields.hash)) return false;
  const a = Buffer.from(responseHash(fields, salt), 'hex');
  const b = Buffer.from(fields.hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}
export function verifyHash(key, txnid, salt) {
  return sha512(`${key}|verify_payment|${txnid}|${salt}`);
}
export function payuEndpoints(mode) {
  if (mode === 'payu_sandbox')
    return {
      checkout: 'https://test.payu.in/_payment',
      verify: 'https://test.payu.in/merchant/postservice?form=2',
    };
  if (mode === 'payu_live')
    return {
      checkout: 'https://secure.payu.in/_payment',
      verify: 'https://info.payu.in/merchant/postservice.php?form=2',
    };
  throw new Error('Unsupported PayU mode');
}
export async function verifyPayment(txnid, key, salt, mode) {
  const body = new URLSearchParams({
    key,
    command: 'verify_payment',
    var1: txnid,
    hash: verifyHash(key, txnid, salt),
  });
  const r = await fetch(payuEndpoints(mode).verify, {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error('PayU verification is temporarily unavailable');
  const json = await r.json();
  return json.transaction_details?.[txnid] || null;
}
