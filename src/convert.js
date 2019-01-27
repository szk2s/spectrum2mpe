import path from 'path';
import _ from 'lodash';
import { txtImport } from './import';
import partials2melodies from './partials2melodies';
import genSMFs from './genSMFs';
import { smfsBatchExport } from './export';

const convertFromSpear = (
  inputFilePath,
  _option = {
    outputDirName: path.dirname(inputFilePath),
    makeOutputFolder: true,
    outputFolderName: 'output'
  }
) =>
  new Promise(async (resolve) => {
    const defaultOption = {
      outputDirName: path.dirname(inputFilePath),
      makeOutputFolder: true,
      outputFolderName: 'output'
    };
    const { outputDirName, makeOutputFolder, outputFolderName } = _.merge(defaultOption, _option);

    const songName = path.basename(inputFilePath, '.txt');
    const partials = await txtImport(inputFilePath);
    const melodies = await partials2melodies(partials);
    const smfs = await genSMFs(melodies, songName);
    await smfsBatchExport(smfs, songName, outputDirName, {
      makeOutputFolder: makeOutputFolder,
      outputFolderName: outputFolderName
    });
    console.log('Completed!');
    resolve();
  });

export default convertFromSpear;
