const fs = require('fs');
const Utils = require('../Utils');

class CsvImport {
    constructor(initInfo){
        this.inputFreqsFilepath = initInfo.config.inputFreqsFilepath;
        this.inputAmpsFilepath = initInfo.config.inputAmpsFilepath;
    }

    process(data){
        return new Promise((resolve, reject) => {
            console.log('Converting files...')
            // load csv files and parse matrix into array 
            data.freqs = parseCSV(this.inputFreqsFilepath);
            data.amps = parseCSV(this.inputAmpsFilepath);
            data.amps = data.amps.map(item => Utils.normalize(item));     //normalize amplitudes
            resolve(data)
        })

        function parseCSV(filepath){
            let array = fs.readFileSync(filepath).toString().split("\n");
            if (array[array.length-1] == ""){array.pop();}
            for(let i in array) {
                array[i]=array[i].split(",").map(Number);
            }
            return array
        }
    }

    
}

module.exports = CsvImport;