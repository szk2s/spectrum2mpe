const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

class SmfPlayer {
    constructor(initInfo){
        this.outputDeviceName = initInfo.outputDeviceName;
    }
    process(data){
        return new Promise((resolve, reject) => {
            console.log('Playing...');
            let midiout = JZZ().openMidiOut(this.outputDeviceName);
            let player = data.smf.player();
            player.connect(midiout);
            player.play();
            resolve(data)
        })
    }
}

module.exports = SmfPlayer;