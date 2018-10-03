const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

class BoxName {
    constructor(arg){
        
    }

    process(data){
        console.log('Processing...');
        // 
        // Instructions to process the input data
        // 
        return data;
    }
}

module.exports = BoxName;