const Patcher = require('./lib/Patcher');

// set up the convert options 
const config = {
    inputFreqsFilepath : './assets/test/cello_freqs_16ch.csv',
    inputAmpsFilepath : './assets/test/cello_amps_16ch.csv',
    outputFileName : 'cello_test.mid',
    outputDeviceName : 'Apple DLS Synth',
    ppqr : 48,   // ticks per quarter note
    bpm : 120,
    defaultVelocity : 10,
    pitchBendRange : 24
};

const patcher = new Patcher(config);

patcher.addBox('CSV Import');
patcher.addBox('Analyser');
patcher.addBox('SMF Generator');
patcher.addBox('SMF Player');
patcher.addBox('SMF Export');

patcher.run();