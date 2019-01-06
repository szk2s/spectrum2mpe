const fs = require('fs');
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
const mime = require('mime-types');
const path = require('path');

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

const smfImport = (inputPath) =>
  new Promise((resolve) => {
    if (
      fs.lstatSync(inputPath).isFile() &&
      mime.lookup(inputPath) == 'audio/midi'
    ) {
      const smfs = singleSmfImport(inputPath);
      resolve(smfs);
    } else if (fs.lstatSync(inputPath).isDirectory()) {
      const smfs = multiSmfsImport(inputPath);
      resolve(smfs);
    } else {
      throw new Error('Invalid file type');
    }
  });

function singleSmfImport(inputPath) {
  const data = fs.readFileSync(inputPath, 'binary');
  const smfs = [new JZZ.MIDI.SMF(data)];
  return smfs;
}

function multiSmfsImport(inputPath) {
  const filepaths = fs.readdirSync(inputPath).map((filename) => {
    return path.join(inputPath, filename);
  });
  const midiFilepaths = filepaths.filter((filepath) => {
    return mime.lookup(filepath) == 'audio/midi';
  });

  const smfs = midiFilepaths.reduce((smfs, filepath) => {
    const data = fs.readFileSync(filepath, 'binary');
    smfs.push(new JZZ.MIDI.SMF(data));
    return smfs;
  }, []);

  return smfs;
}

module.exports = { txtImport, smfImport };
