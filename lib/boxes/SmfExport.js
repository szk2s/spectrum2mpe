const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

class SmfExport {
    constructor(arg){
        this.outputFilepath = arg.config.outputFilepath;
    }

    process(data){
        console.log('Exporting...');
        require('fs').writeFileSync(this.outputFilepath, data.smf.dump(), 'binary');
        console.log('MIDI export completed!');
        return data;
    }
}

module.exports = SmfExport;