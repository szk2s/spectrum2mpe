const fs = require('fs');
const Utils = require('../Utils');

class CsvImport {
    constructor(arg){
        this.inputFreqsFilepath = arg.config.inputFreqsFilepath;
        this.inputAmpsFilepath = arg.config.inputAmpsFilepath;
    }

    process(data){
        console.log('Converting files...')
        // load csv files and parse matrix into array 
        data['freqs'] = parseCSV(this.inputFreqsFilepath);
        data['amps'] = parseCSV(this.inputAmpsFilepath);
        data.amps = data.amps.map(item => Utils.normalize(item));     //normalize amplitudes
        
        return data

        function parseCSV(filepath){
            let array = fs.readFileSync(filepath).toString().split("\n");
            for(let i in array) {
                array[i]=array[i].split(",").map(Number);
            }
            return array
        }
    }
}

module.exports = CsvImport;