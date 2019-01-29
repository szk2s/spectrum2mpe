/* @flow */
const s2m = require('../..');
const path = require('path');

let partials: Array<Partial>;
let melodies: Array<Melody>;

test('should return an array of partials', async () => {
  partials = await s2m.txtImport(path.join(__dirname, '../assets/txt/large_bowl.txt'));
  const partial = partials[14];
  expect(partial).toHaveProperty('id');
  expect(partial).toHaveProperty('freqs');
  expect(partial).toHaveProperty('amps');
  expect(partial).toHaveProperty('timecode');
  expect(partial).toHaveProperty('startTime');
  expect(partial).toHaveProperty('endTime');
});

test('should return an array of melodies', async () => {
  melodies = await s2m.partials2melodies(partials);
  const melody = melodies[5];
  expect(melody).toHaveProperty('noteOnOffs');
  expect(melody).toHaveProperty('midiNoteNums');
  expect(melody).toHaveProperty('deltaCents');
  expect(melody).toHaveProperty('timecode');
  expect(melody).toHaveProperty('amps');
  expect(melody).toHaveProperty('endTime');
});
