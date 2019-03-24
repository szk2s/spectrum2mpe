/* @flow */

const s2m = require('..');
const fs = require('fs');

const convert = async () => {
  const partials = await s2m.jsonImport(__dirname + '/assets/json/japanese_nightingale_short.json');
  const jsonData = {
    pitch: {},
    amp: {}
  };

  partials.forEach((partial, idx) => {
    jsonData.pitch[idx] = partial.freqs.map((freq) => s2m.utils.ftom(freq));
    jsonData.amp[idx] = partial.amps;
  });

  fs.writeFileSync(__dirname + '/output/toParticleReverb/uguisu.json', JSON.stringify(jsonData));
  console.log('Completed!');
};

convert();
