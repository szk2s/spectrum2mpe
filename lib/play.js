//Deprecated (under Development, current fixing)
function smfPlay(data){
    return new Promise((resolve, reject) => {
        console.log('Playing...');
        let midiout = JZZ().openMidiOut(this.config.outputDeviceName);
        let player = data.smf.player();
        player.connect(midiout);
        player.play();
        resolve(data);
    });
}