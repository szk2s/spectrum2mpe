const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

class SmfExport {
    constructor(arg){
        this.outputFileName = arg.config.outputFileName;
    }

    process(data){
        console.log('Exporting...');
        require('fs').writeFileSync('./output/'+this.outputFileName, data.smf.dump(), 'binary');
        console.log('MIDI export completed!');
        return data;
    }
}

module.exports = SmfExport;