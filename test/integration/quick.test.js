/* @flow */
const s2m = require('../..');
const path = require('path');

let partials: Array<Partial>;
let melodies: Array<Melody>;

test('should return an array of partials', async () => {
  partials = await s2m.textImport(path.join(__dirname, '../assets/txt/large_bowl.txt'));
  const partial = partials[14];
  expect(typeof partial.id).toBe('number');
  const point = partials[5].points[6];
  expect(typeof point.time).toBe('number');
  expect(typeof point.freq).toBe('number');
  expect(typeof point.amp).toBe('number');
});

test('should return an array of partials', async () => {
  const partials: Array<Partial> = await s2m.jsonImport(path.join(__dirname, '../assets/json/bird.json'));
  const partial = partials[6];
  expect(typeof partial.id).toBe('number');
  const point = partials[23].points[11];
  expect(typeof point.time).toBe('number');
  expect(typeof point.freq).toBe('number');
  expect(typeof point.amp).toBe('number');
});
