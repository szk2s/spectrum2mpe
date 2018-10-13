module.exports = {
    inputFreqsFilepath : './assets/user/csv/church2_freqs.csv',
    inputAmpsFilepath : './assets/user/csv/church2_amps.csv',
    inputTimecodeFilepath : './assets/user/csv/church2_timecode.csv',
    inputEnvFilepath:  './assets/user/csv/child_env.csv',
    outputFilepath : './output/church2.mid',
    outputDeviceName : 'IAC Driver Bus 1',
    ppqr : 96,   // ticks per quarter note
    bpm : 120,
    defaultVelocity : 10,
    pitchBendRange : 48,
    oscClient : {ip : '127.0.0.1', port : 1234},
    slideCC : 74
};