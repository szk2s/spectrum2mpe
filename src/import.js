/* @flow */

import fs from 'fs';
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
import mime from 'mime-types';
import * as path from 'path';
import INIT_PARTIAL from './constants/INIT_PARTIAL';

const txtImport = (inputFilepath: string): Promise<Array<Partial>> => {
  console.log('Importing files...');
  const text = fs.readFileSync(inputFilepath).toString();
  const partials = parseText(text);
  return Promise.resolve(partials);
};

const jsonImport = (inputFilepath: string): Promise<Array<Partial>> => {
  console.log('Importing files...');
  const inputText = fs.readFileSync(inputFilepath, 'utf8');
  const matlabFormatObj = JSON.parse(inputText);
  const partials = formatAsPartials(matlabFormatObj);
  return Promise.resolve(partials);
};

const smfImport = (inputPath: string): Promise<Array<any>> => {
  if (fs.lstatSync(inputPath).isFile() && mime.lookup(inputPath) == 'audio/midi') {
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
function parseText(text: string): Array<Partial> {
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
        startTime: floatArray[2],
        endTime: floatArray[3],
        timecode: [],
        freqs: [],
        amps: []
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

function formatAsPartials(matlabFormatObj: {
  amps: Array<Array<number>>,
  times: Array<number>,
  freqs: Array<number>,
  soundname: string
}): Array<Partial> {
  const partials = matlabFormatObj.freqs.map((freq, idx) => {
    const times = matlabFormatObj.times;
    const amps = matlabFormatObj.amps[idx];
    const freqs = times.map(() => freq);
    const partial = {
      id: idx,
      startTime: times[0],
      endTime: times[times.length - 1],
      amps,
      freqs,
      timecode: times
    };
    return partial;
  });
  return partials;
}

function singleSmfImport(inputPath: string): Array<any> {
  const data = fs.readFileSync(inputPath, 'binary');
  const smfs = [new JZZ.MIDI.SMF(data)];
  return smfs;
}

function multiSmfsImport(inputPath: string): Array<any> {
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

export { txtImport, jsonImport, smfImport };
