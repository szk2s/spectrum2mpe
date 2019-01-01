const path = require('path');
const _ = require('lodash');
const { txtImport } = require('./import');
const partials2melodies = require('./partials2melodies');
const genSMFs = require('./genSMFs');
const { smfsBatchExport } = require('./export');

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
    const { outputDirName, makeOutputFolder, outputFolderName } = _.merge(
      defaultOption,
      _option
    );

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

// //Deprecated (under Development)
// async function convertFromMatlab(songName) {
//   const partials = await this.csvImport(songName);
//   const melodies = await this.partials2melodies(partials);
//   const smfs = await this.genSMFs(melodies, songName);
//   this.smfsBatchExport(smfs, songName);
// }

module.exports = { convertFromSpear };
