/* @flow */
const s2m = require('../..');
const path = require('path');

test('should return an array of partials', async () => {
  const partials: Array<Partial> = await s2m.textImport(path.join(__dirname, '../assets/txt/large_bowl.txt'));
  partials.forEach((partial) => {
    expect(typeof partial.id).toBe('number');
    partial.points.forEach((point) => {
      expect(typeof point.time).toBe('number');
      expect(typeof point.freq).toBe('number');
      expect(typeof point.amp).toBe('number');
    });
  });
});
