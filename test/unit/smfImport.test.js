/* @flow */
const s2m = require('../..');
const path = require('path');
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

test('should return an array of smfs', async () => {
  const smfs: Array<Partial> = await s2m.smfImport(path.join(__dirname, '../assets/mid/cricket.mid'));
  smfs.forEach((smf) => {
    expect(smf).toBeInstanceOf(JZZ.MIDI.SMF);
  });
});
