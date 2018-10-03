const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

class SmfPlayer {
    constructor(arg){
        this.outputDeviceName = arg.config.outputDeviceName;
    }

    process(data){
        console.log('Playing...');
        let midiout = JZZ().openMidiOut(this.outputDeviceName);
        let player = data.smf.player();
        player.connect(midiout);
        player.play();
        return data;
    }
}

module.exports = SmfPlayer;