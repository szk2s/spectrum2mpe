/* @flow */
const s2m = require('../..');
const path = require('path');

test('should return an array of partials', async () => {
  const partials: Array<Partial> = await s2m.txtImport(path.join(__dirname, '../assets/txt/large_bowl.txt'));
  partials.forEach((partial) => {
    expect(partial).toHaveProperty('id');
    expect(partial).toHaveProperty('freqs');
    expect(partial).toHaveProperty('amps');
    expect(partial).toHaveProperty('timecode');
    expect(partial).toHaveProperty('startTime');
    expect(partial).toHaveProperty('endTime');
  });
});
