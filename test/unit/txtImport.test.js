const { assert } = require('chai');
const path = require('path');
const s2m = require('../../lib');

describe('txtImport', function() {
  it('should return an array of partials', async function() {
    const partials = await s2m.txtImport(path.join(__dirname,'../assets/txt/large_bowl.txt'));
    assert.typeOf(partials, 'array');
    partials.forEach((partial) => {
      assert.property(partial, 'freqs');
      assert.property(partial, 'amps');
      assert.property(partial, 'timecode');
      assert.property(partial, 'endTime');
    });
  });
});