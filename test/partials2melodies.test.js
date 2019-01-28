/* @flow */
const s2m = require('..');

test('should return an array of melodies', async () => {
  const partials: Array<Partial> = await s2m.txtImport(__dirname + '/assets/txt/large_bowl.txt');
  const melodies: Array<Melody> = await s2m.partials2melodies(partials);
  melodies.forEach((melody) => {
    expect(melody).toHaveProperty('noteOnOffs');
    expect(melody).toHaveProperty('midiNoteNums');
    expect(melody).toHaveProperty('deltaCents');
    expect(melody).toHaveProperty('timecode');
    expect(melody).toHaveProperty('amps');
    expect(melody).toHaveProperty('endTime');
    expect(melody).toHaveProperty('startTime');
  });
});
