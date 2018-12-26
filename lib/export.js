const _ = require('lodash');
const fs = require('fs');
const path = require('path');

function smfExport(smf, outputFilePath = './untitled.mid') {
    return new Promise((resolve, reject) => {
        const fileName = path.parse(outputFilePath).base;
        console.log('Exporting ' + fileName + ' ...');

        fs.writeFileSync(outputFilePath, smf.dump(), 'binary');
        console.log(fileName + ' exported!');
        console.log('The result file is at');
        console.log(outputFilePath);
        resolve();
    });
}

function smfsBatchExport(
    smfs,
    songName = 'untitled',
    destination = '.',
    _option = {
        makeOutputFolder: true,
        outputFolderName: 'output'
    }
) {
    return new Promise(async (resolve, reject) => {
        const defaultOption = {
            makeOutputFolder: true,
            outputFolderName: 'output'
        }
        const {
            makeOutputFolder,
            outputFolderName
        } = _.merge(defaultOption, _option);
        
        let outputFolderPath;
        if (makeOutputFolder) {
            outputFolderPath = path.join(destination, outputFolderName)
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
}

module.exports = {
    smfExport,
    smfsBatchExport
};