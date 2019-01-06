const s2m = require('..');

const readAndPlaySMF = async () => {
  const smfs = await s2m.smfImport(__dirname + '/assets/mid/cricket.mid');

  const ports = await s2m.outputPorts();
  console.log('Available ports are');
  ports.forEach((port, idx) => {
    console.log(idx + ': ' + port.name);
  });

  await s2m.smfPlay(smfs[0], 1);
};

readAndPlaySMF();
