import assert from 'node:assert/strict';
import test from 'node:test';
import { isSameOrigin } from '../src/lib/request-origin';

test('development accepts normalized loopback URLs only for the actual browser host', () => {
  const url = 'http://localhost:3210/api/auth';
  assert.equal(isSameOrigin('http://127.0.0.1:3210', url, '127.0.0.1:3210', true), true);
  assert.equal(isSameOrigin('http://localhost:3210', url, 'localhost:3210', true), true);
  for (const origin of [null, 'null', 'https://127.0.0.1:3210', 'http://127.0.0.1:3211', 'https://evil.example', 'http://localhost.evil.example:3210', 'invalid']) {
    assert.equal(isSameOrigin(origin, url, '127.0.0.1:3210', true), false);
  }
  assert.equal(isSameOrigin('http://127.0.0.1:3210', url, 'localhost:3210', true), false);
});

test('production requires exact origins', () => {
  assert.equal(isSameOrigin('https://recall.example', 'https://recall.example/api/auth', 'recall.example', false), true);
  assert.equal(isSameOrigin('http://127.0.0.1:3210', 'http://localhost:3210/api/auth', '127.0.0.1:3210', false), false);
  assert.equal(isSameOrigin('https://evil.example', 'https://recall.example/api/auth', 'evil.example', false), false);
});
