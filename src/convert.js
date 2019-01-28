/* @flow */
import path from 'path';
import _ from 'lodash';
import textImport from './textImport';
import partials2melodies from './partials2melodies';
import genSMFs from './genSMFs';
import { smfsBatchExport } from './export';

const convertFromSpear = async (
  inputFilePath: string,
  _option: Object = {
    outputDirName: path.dirname(inputFilePath),
    makeOutputFolder: true,
    outputFolderName: 'output'
  }
): Promise<void> => {
  const defaultOption = {
    outputDirName: path.dirname(inputFilePath),
    makeOutputFolder: true,
    outputFolderName: 'output'
  };
  const { outputDirName, makeOutputFolder, outputFolderName } = _.merge(defaultOption, _option);

  const songName = path.basename(inputFilePath, '.txt');
  const partials = await textImport(inputFilePath);
  const melodies = await partials2melodies(partials);
  const smfs = await genSMFs(melodies, songName);
  await smfsBatchExport(smfs, songName, outputDirName, {
    makeOutputFolder: makeOutputFolder,
    outputFolderName: outputFolderName
  });
  console.log('Completed!');
  return Promise.resolve();
};

export default convertFromSpear;
