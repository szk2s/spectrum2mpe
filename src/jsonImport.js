/* @flow */
import * as fs from 'fs';

// This function imports json file which MATLAB exports.
// Matlab format is something like "X axis = time, Y axis = freq, Value = amp"
// Times and freqs are 1d Array, but amp is 2d Array

const jsonImport = (filepath: string): Promise<Array<Partial>> => {
  console.log('Importing files...');
  const inputText = fs.readFileSync(filepath, 'utf8');
  const matlabFormatObj = JSON.parse(inputText);
  const partials = formatAsPartials(matlabFormatObj);
  return Promise.resolve(partials);
};

// define subfunctions
function formatAsPartials(matlabFormatObj: {
  amps: Array<Array<number>>,
  times: Array<number>,
  freqs: Array<number>,
  soundname: string
}): Array<Partial> {
  const partials = matlabFormatObj.freqs.map((freq, i) => {
    const times = matlabFormatObj.times;
    const amps2d = matlabFormatObj.amps;
    const partial = {
      id: i,
      points: times.map((time, j) => {
        return {
          time: time,
          freq: freq,
          amp: amps2d[i][j]
        };
      })
    };
    return partial;
  });
  return partials;
}

export default jsonImport;
