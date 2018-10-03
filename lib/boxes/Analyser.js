const Utils = require('../Utils');

class Analyser {
    constructor(arg){
    }

    process(data){
        console.log('Analysing data...');
        data['noteOnOff'] = [];
        data['quantizedNoteNum'] = [];
        data['timecode'] = data.freqs[0].map((x, idx) => idx);
        data.amps.forEach((item) => {
            data.noteOnOff.push(Utils.detectNoteOnNoteOffIndices(item));
        });
        data.freqs.forEach((item) =>{
            const result = item.map(x => Math.round(Utils.ftom(x)));
            data.quantizedNoteNum.push(result);
        });
        return data;
    }
}

module.exports = Analyser;