module.exports = {
  outputDeviceName: 'IAC Driver Bus 1',
  ppqn: 48, // ticks per quarter note
  bpm: 120,
  defaultVelocity: 10,
  pitchBendRange: 48,
  oscClient: { ip: '127.0.0.1', port: 1234 },
  slideCC: 74,
  directories: {
    assets: __dirname + '/assets',
    output: __dirname + '/output'
  }
};
