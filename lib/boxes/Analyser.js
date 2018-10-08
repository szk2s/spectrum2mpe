const Utils = require('../Utils');

class Analyser {
    process(data){
        return new Promise((resolve, reject) => {
            console.log('Analysing data...');
            data.noteOnOff= [];
            data.quantizedNoteNum = [];
            data.timecode = data.freqs[0].map((x, idx) => idx);
            data.amps.forEach((item) => {
                data.noteOnOff.push(Utils.detectNoteOnNoteOffIndices(item));
            });
            data.freqs.forEach((item) =>{
                const result = item.map(x => Math.round(Utils.ftom(x)));
                data.quantizedNoteNum.push(result);
            });
            resolve(data)
        })
    }
}

module.exports = Analyser;