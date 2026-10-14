import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { THEME_BOOT_SCRIPT, THEME_KEY, resolveTheme } from '../src/lib/theme';

test('theme restoration accepts only known themes, runs before paint, and tolerates blocked storage', () => {
  for (const [stored, expected] of [['classic', 'classic'], ['paper', 'paper'], [null, 'paper'], ['<script>', 'paper']] as const) {
    const document = { documentElement: { dataset: { theme: 'paper' } } };
    runInNewContext(THEME_BOOT_SCRIPT, { document, localStorage: { getItem: (key: string) => { assert.equal(key, THEME_KEY); return stored; } } });
    assert.equal(document.documentElement.dataset.theme, expected);
    assert.equal(resolveTheme(stored), expected);
  }
  const document = { documentElement: { dataset: { theme: 'paper' } } };
  assert.doesNotThrow(() => runInNewContext(THEME_BOOT_SCRIPT, { document, localStorage: { getItem: () => { throw new Error('Blocked'); } } }));
  assert.equal(document.documentElement.dataset.theme, 'paper');
});
