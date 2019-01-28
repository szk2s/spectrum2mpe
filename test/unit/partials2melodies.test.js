const { assert } = require('chai');
const s2m = require('../../lib');
const genMockPartials = require('../helpers/genMockPartials');

describe('partials2melodies', function() {
  let partials;
  before(async () => {
    partials = await genMockPartials();
  });
  it('should return an array of melodies ', async function() {
    melodies = await s2m.partials2melodies(partials);
    assert.typeOf(melodies, 'array');
    melodies.forEach((melody) => {
      assert.property(melody, 'noteOnOffs');
      assert.property(melody, 'activeNoteNums');
      assert.property(melody, 'deltaCents');
      assert.property(melody, 'amps');
      assert.property(melody, 'timecode');
      assert.property(melody, 'endTime');
    });
  });
});