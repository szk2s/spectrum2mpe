const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

class MasterChannelCC {
    constructor(initInfo){
        this.slideCC = initInfo.slideCC;
    }

    process(data){
        return new Promise((resolve, reject) => {
            console.log('Now processing 1ch as a master channel...');
            const trk = data.smf[0];
            addSlideCC(this.slideCC);
            data.smf[0] = trk;
            resolve(data)

            function addSlideCC(ccNum){
                data.env[0].forEach((val, idx) => {
                    let msg = JZZ.MIDI.control(0, ccNum, Math.round(val*127));
                    trk.add(data.timecode[idx], msg);                    
                });
            }
        })
    }
}


module.exports = MasterChannelCC;