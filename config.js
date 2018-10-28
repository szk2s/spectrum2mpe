module.exports = {
    inputFreqsFilepath : './assets/test/csv/bird_freqs.csv',
    inputAmpsFilepath : './assets/test/csv/bird_amps.csv',
    inputTimecodeFilepath : './assets/test/csv/bird_timecode.csv',
    inputEnvFilepath:  './assets/test/csv/bird_env.csv',
    outputFilepath : './output/bird.mid',
    outputDeviceName : 'IAC Driver Bus 1',
    ppqr : 48,   // ticks per quarter note
    bpm : 120,
    defaultVelocity : 10,
    pitchBendRange : 48,
    oscClient : {ip : '127.0.0.1', port : 1234},
    slideCC : 74
};