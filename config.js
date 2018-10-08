module.exports = {
    inputFreqsFilepath : './assets/user/csv/bird_freqs.csv',
    inputAmpsFilepath : './assets/user/csv/bird_amps.csv',
    inputTimecodeFilepath : './assets/user/csv/bird_timecode.csv',
    outputFilepath : './output/bird.mid',
    outputDeviceName : 'IAC Driver Bus 1',
    ppqr : 96,   // ticks per quarter note
    bpm : 120,
    defaultVelocity : 10,
    pitchBendRange : 24,
    oscClient : {ip : '127.0.0.1', port : 1234}
};


// default setting

// module.exports = {
//     inputFreqsFilepath : './assets/test/csv/cello_freqs.csv',
//     inputAmpsFilepath : './assets/test/csv/cello_amps.csv',
//     outputFilepath : './output/childvoice_test.mid',
//     outputDeviceName : 'Apple DLS Synth',
//     ppqr : 96,   // ticks per quarter note
//     bpm : 120,
//     defaultVelocity : 10,
//     pitchBendRange : 24
// };