import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../src/config/index.js';

describe('Backend Security, Password Hashing & JWT Verification Engine', () => {
  const secretKey = config.jwt.secret;

  it('should hash plain password and successfully verify with bcrypt.compare', async () => {
    const rawPassword = 'industrial_secure_admin_2026';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    assert.notEqual(hashedPassword, rawPassword);
    assert.ok(hashedPassword.startsWith('$2'));

    // Correct password matches
    const isMatch = await bcrypt.compare(rawPassword, hashedPassword);
    assert.equal(isMatch, true);

    // Wrong password fails
    const isWrongMatch = await bcrypt.compare('wrong_password', hashedPassword);
    assert.equal(isWrongMatch, false);
  });

  it('should sign and verify valid JWT authentication tokens', () => {
    const payload = {
      username: 'admin@ecotexinc.com',
      role: 'Chief Administrator'
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    assert.ok(typeof token === 'string' && token.length > 20);

    const decoded = jwt.verify(token, secretKey);
    assert.equal(decoded.username, 'admin@ecotexinc.com');
    assert.equal(decoded.role, 'Chief Administrator');
  });

  it('should reject tampered or invalid JWT signatures', () => {
    const validToken = jwt.sign({ user: 'admin' }, secretKey, { expiresIn: '1h' });
    const wrongSecret = 'wrong_attacker_secret_key_1234';

    assert.throws(() => {
      jwt.verify(validToken, wrongSecret);
    }, /invalid signature/);
  });

  it('should reject expired JWT tokens', () => {
    // Generate token with negative lifespan (already expired)
    const expiredToken = jwt.sign({ user: 'admin' }, secretKey, { expiresIn: '-1s' });

    assert.throws(() => {
      jwt.verify(expiredToken, secretKey);
    }, /jwt expired/);
  });
});
