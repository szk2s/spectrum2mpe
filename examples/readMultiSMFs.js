const s2m = require('..');

const readAndPlayMultiSMF = async () => {
  const smfs = await s2m.smfImport(__dirname + '/assets/mid/chozuya');
  const ports = await s2m.outputPorts();
  console.log('Available ports are');
  ports.forEach((port, idx) => {
    console.log(idx + ': ' + port.name);
  });
  const playoutPortIndices = new Array(smfs.length).fill().map((_, i) => i + 1);
  await s2m.smfsMultiPlay(smfs, playoutPortIndices);
};

readAndPlayMultiSMF();
