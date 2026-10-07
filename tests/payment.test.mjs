import test from 'node:test';
import assert from 'node:assert/strict';
import {
  requestHash,
  responseHash,
  validResponseHash,
  verifyHash,
  payuEndpoints,
} from '../lib/payu.mjs';
import { hashPassword, verifyPassword } from '../lib/security.mjs';
const fields = {
  key: 'test-key',
  txnid: 'txn-123',
  amount: '118.00',
  productinfo: 'Veehoster order',
  firstname: 'Alex',
  email: 'alex@example.com',
  udf1: 'order-123',
  status: 'success',
};
test('sandbox and live modes use distinct fixed HTTPS destinations', () => {
  assert.equal(payuEndpoints('payu_sandbox').checkout, 'https://test.payu.in/_payment');
  assert.equal(payuEndpoints('payu_live').checkout, 'https://secure.payu.in/_payment');
  assert.equal(
    payuEndpoints('payu_live').verify,
    'https://info.payu.in/merchant/postservice.php?form=2',
  );
});
test('unsupported payment modes cannot select a gateway', () => {
  assert.throws(() => payuEndpoints('demo'), /Unsupported PayU mode/);
  assert.throws(() => payuEndpoints('https://attacker.example'), /Unsupported PayU mode/);
});
// Fixed vectors independently computed from the literal PayU field sequences.
test('PayU request hash preserves all empty UDF fields', () => {
  assert.equal(
    requestHash(fields, 'test-salt'),
    '2514b8ca1f1cc82c7e1da1b295736683656338d8681397f4e018b38b450199cb0383c9d4cb32381cec75ea80d6b12617992cdec61e1f13e70fe8b1eb637a0b42',
  );
});
test('PayU reverse hash uses the callback sequence', () => {
  assert.equal(
    responseHash(fields, 'test-salt'),
    '36a10a67abe7839338ba4e25b231483e0d7e2c635c25e61b919c72b5c855efe997602d99d2902cd47f586f74b88bf2312af9792924e7a45d89a703a9b7e0752b',
  );
});
test('additional charges are included in the reverse hash', () => {
  assert.equal(
    responseHash({ ...fields, additionalCharges: '2.00' }, 'test-salt'),
    '4e296e6e83300b2f9abc3e41e8e4db92f6a44fb9b6ea84cc2983c399c0839483d4ed93e6c2a247357e5adc1216a864a4d05d7cdb555fd6b9788e0db45f25b04a',
  );
});
test('tampered amounts, status and malformed hashes are rejected', () => {
  const hash = responseHash(fields, 'test-salt');
  assert.equal(validResponseHash({ ...fields, hash }, 'test-salt'), true);
  assert.equal(validResponseHash({ ...fields, amount: '1.00', hash }, 'test-salt'), false);
  assert.equal(validResponseHash({ ...fields, status: 'failure', hash }, 'test-salt'), false);
  assert.equal(validResponseHash({ ...fields, hash: 'invalid' }, 'test-salt'), false);
});
test('server-to-server verification hash matches a fixed vector', () => {
  assert.equal(
    verifyHash('test-key', 'txn-123', 'test-salt'),
    'af2ed1e90c92fc652758d95f92451ad6793727621101d7c9b79f47fc24040d98d119b4bd52531d8ce2632378d9242379817a1d21f9469d67db163ae8d70cecdf',
  );
});
test('password storage uses unique salts and rejects wrong passwords', async () => {
  const a = await hashPassword('a sample passphrase for tests');
  const b = await hashPassword('a sample passphrase for tests');
  assert.notEqual(a, b);
  assert.equal(await verifyPassword('a sample passphrase for tests', a), true);
  assert.equal(await verifyPassword('the wrong passphrase', a), false);
});
