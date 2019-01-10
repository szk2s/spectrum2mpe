const fs = require('fs');
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
const mime = require('mime-types');
const path = require('path');

function txtImport(inputFilepath) {
  console.log('Importing files...');
  //load txt files (exported by spear)
  const text = fs.readFileSync(inputFilepath).toString();
  const partials = parseText(text);
  return Promise.resolve(partials);
}

const smfImport = (inputPath) => {
  if (
    fs.lstatSync(inputPath).isFile() &&
    mime.lookup(inputPath) == 'audio/midi'
  ) {
    const smfs = singleSmfImport(inputPath);
    return Promise.resolve(smfs);
  }
  if (fs.lstatSync(inputPath).isDirectory()) {
    const smfs = multiSmfsImport(inputPath);
    return Promise.resolve(smfs);
  }
  return Promise.reject(new Error('Invalid file type'));
};

// define subfunctions
function parseText(text) {
  const textArray = text.split('\n');
  if (textArray[textArray.length - 1] == '') {
    textArray.pop();
  }

  const partials = textArray.reduce((partials, stringData, idx) => {
    const floatArray = stringData.split(/\s+/).map(Number);
    if (Number.isNaN(floatArray[0])) {
      return partials;
    }
    if (idx % 2 === 0) {
      partials.push({
        id: floatArray[0],
        numFrames: floatArray[1],
        startTime: floatArray[2],
        endTime: floatArray[3]
      });
      return partials;
    }
    if (idx % 2 === 1) {
      const partial = partials[partials.length - 1];
      partial.timecode = floatArray.filter((_, idx) => idx % 3 === 0);
      partial.freqs = floatArray.filter((_, idx) => idx % 3 === 1);
      partial.amps = floatArray.filter((_, idx) => idx % 3 === 2);
      return partials;
    }
    return partials;
  }, []);

  return partials;
}

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
