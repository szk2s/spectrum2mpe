const fs = require('fs');
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

function txtImport(inputFilepath) {
  return new Promise((resolve) => {
    console.log('Importing files...');
    //load txt files (exported by spear)
    const text = fs.readFileSync(inputFilepath).toString();
    const partials = parseText(text);
    resolve(partials);

    // define subfunctions
    function parseText(text) {
      const textArray = text.split('\n');
      if (textArray[textArray.length - 1] == '') {
        textArray.pop();
      }

      const partials = textArray.reduce((partials, stringData, idx) => {
        const floatArray = stringData.split(/\s+/).map((item) => Number(item));
        if (Number.isNaN(floatArray[0])) {
          return partials;
        } else if (idx % 2 === 0) {
          partials.push({
            id: floatArray[0],
            numFrames: floatArray[1],
            startTime: floatArray[2],
            endTime: floatArray[3]
          });
          return partials;
        } else if (idx % 2 === 1) {
          partials[partials.length - 1].timecode = floatArray.filter(
            (_, idx) => idx % 3 === 0
          );
          partials[partials.length - 1].freqs = floatArray.filter(
            (_, idx) => idx % 3 === 1
          );
          partials[partials.length - 1].amps = floatArray.filter(
            (_, idx) => idx % 3 === 2
          );
          return partials;
        } else {
          return partials;
        }
      }, []);

      return partials;
    }
  });
}

const smfImport = (path) =>
  new Promise((resolve) => {
    const data = fs.readFileSync(path, 'binary');
    return resolve(new JZZ.MIDI.SMF(data));
  });

module.exports = { txtImport, smfImport };
