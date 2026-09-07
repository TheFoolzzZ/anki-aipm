import assert from 'node:assert/strict';
import test from 'node:test';
import { trustedLessonImageUrl } from '../src/lib/lesson-images';

test('lesson images embed only HTTPS assets from the configured Cloudinary host', () => {
  assert.equal(
    trustedLessonImageUrl('https://res.cloudinary.com/demo/image/upload/example.png'),
    'https://res.cloudinary.com/demo/image/upload/example.png',
  );
  assert.equal(trustedLessonImageUrl('http://res.cloudinary.com/demo/image.png'), null);
  assert.equal(trustedLessonImageUrl('https://res.cloudinary.com.evil.example/image.png'), null);
  assert.equal(trustedLessonImageUrl('javascript:alert(1)'), null);
});
