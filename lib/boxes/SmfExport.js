const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
const fs = require('fs');

class SmfExport {
    constructor(arg){
        this.outputFilepath = arg.config.outputFilepath;
    }

    process(data){
        console.log('Exporting...');
        fs.writeFileSync(this.outputFilepath, data.smf.dump(), 'binary');
        console.log('MIDI export completed!');
        return data;
    }
}

module.exports = SmfExport;