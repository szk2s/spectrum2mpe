/* @flow */

import fs from 'fs';
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
import mime from 'mime-types';
import * as path from 'path';

// This function imports smfs (standard midi files),
// converts them into array of JZZ.MIDI.SMF instances

const smfImport = (filepath: string): Promise<Array<any>> => {
  if (fs.lstatSync(filepath).isFile() && mime.lookup(filepath) == 'audio/midi') {
    const smfs = singleSmfImport(filepath);
    return Promise.resolve(smfs);
  }
  if (fs.lstatSync(filepath).isDirectory()) {
    const smfs = multiSmfsImport(filepath);
    return Promise.resolve(smfs);
  }
  return Promise.reject(new Error('Invalid file type'));
};

// define subfunctions

function singleSmfImport(filepath: string): Array<any> {
  const data = fs.readFileSync(filepath, 'binary');
  const smfs = [new JZZ.MIDI.SMF(data)];
  return smfs;
}

function multiSmfsImport(filepath: string): Array<any> {
  const filepaths = fs.readdirSync(filepath).map((filename) => {
    return path.join(filepath, filename);
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

export default smfImport;
