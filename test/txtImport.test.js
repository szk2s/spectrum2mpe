/* @flow */
const s2m = require('..');

test('should return an array of partials', async () => {
  const partials: Array<Partial> = await s2m.txtImport(__dirname + '/assets/txt/large_bowl.txt');
  partials.forEach((partial) => {
    expect(partial).toHaveProperty('id');
    expect(partial).toHaveProperty('freqs');
    expect(partial).toHaveProperty('amps');
    expect(partial).toHaveProperty('timecode');
    expect(partial).toHaveProperty('startTime');
    expect(partial).toHaveProperty('endTime');
  });
});
