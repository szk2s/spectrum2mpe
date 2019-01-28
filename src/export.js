/* @flow */

import _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

const smfExport = (smf: any, outputFilePath: string = './untitled.mid'): Promise<void> => {
  return new Promise((resolve) => {
    const fileName = path.parse(outputFilePath).base;
    console.log('Exporting ' + fileName + ' ...');

    fs.writeFileSync(outputFilePath, smf.dump(), 'binary');
    console.log(fileName + ' exported!');
    console.log('The result file is at');
    console.log(outputFilePath);
    resolve();
  });
};

const smfsBatchExport = (
  smfs: Array<any>,
  songName: string = 'untitled',
  destination: string = '.',
  _option: Object = {
    makeOutputFolder: true,
    outputFolderName: 'output'
  }
): Promise<void> => {
  return new Promise(async (resolve) => {
    const defaultOption = {
      makeOutputFolder: true,
      outputFolderName: 'output'
    };
    const { makeOutputFolder, outputFolderName } = _.merge(defaultOption, _option);

    let outputFolderPath;
    if (makeOutputFolder) {
      outputFolderPath = path.join(destination, outputFolderName);
      if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
      }
    } else {
      outputFolderPath = destination;
    }

    if (smfs.length == 1) {
      const outputFilePath = path.join(outputFolderPath, songName + '.mid');
      await smfExport(smfs[0], outputFilePath);
    } else {
      await Promise.all(
        smfs.map((smf, idx) => {
          const outputFilePath = path.join(outputFolderPath, songName + '-' + (idx + 1) + '.mid');
          return smfExport(smf, outputFilePath);
        })
      );
    }
    console.log('All files have been exported successfully!!');
    resolve();
  });
};

export { smfExport, smfsBatchExport };
