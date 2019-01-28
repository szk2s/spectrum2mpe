/* @flow */

import * as fs from 'fs';
import _ from 'lodash';

// This function is for importing text file which SPEAR exports.
// SPEAR(http://www.klingbeil.com/spear/)
// Text file can be separated into header and body.
// header contains text (not a Number), but body doesn't.
// body has alternate lines of metadata line and partial data line.
// partial data is repetition of numbers [time, freq, amp, time, freq, amp...]

const textImport = ({ filepath }: { filepath: string }): Promise<Array<Partial>> => {
  console.log('Importing files...');
  const text = fs.readFileSync(filepath).toString();
  const partials = parseText(text);
  return Promise.resolve(partials);
};

// define subfunctions
function parseText(text: string): Array<Partial> {
  const lines: Array<string> = text.split('\n');
  const linesWithOnlyNumbers = lines.filter((oneLine) => {
    if (typeof oneLine === 'string' && oneLine !== '') {
      const allItemIsNumber = !oneLine.split(/\s+/).some((item) => isNaN(Number(item)));
      if (allItemIsNumber) {
        return true;
      }
    }
    return false;
  });
  const numbersIncludedInEachLine: Array<Array<number>> = linesWithOnlyNumbers.map((line) => {
    return line.split(/\s+/).map(Number);
  });
  const numbersInPartialDataLine = numbersIncludedInEachLine.filter((_, idx) => idx % 2 === 1);
  const partials = numbersInPartialDataLine.map((numbersInOneLine, idx) => {
    const chunks = _.chunk(numbersInOneLine, 3);
    const points = chunks.map((chunk) => {
      return {
        time: chunk[0],
        freq: chunk[1],
        amp: chunk[2]
      };
    });
    const partial = {
      id: idx,
      points: points
    };
    return partial;
  });
  return partials;
}

export default textImport;
