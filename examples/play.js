const s2m = require('..');

const play = async () => {
  const partials = await s2m.txtImport(__dirname + '/assets/txt/large_bowl.txt');
  const melodies = await s2m.partials2melodies(partials);
  const smfs = await s2m.genSMFs(melodies, 'test-song');
  const ports = await s2m.outputPorts();
  console.log('Available ports are');
  ports.forEach((port, idx) => {
    console.log(idx + ': ' + port.name);
  });
  await s2m.smfsMultiPlay(smfs, [1, 2, 3]);
  console.log('Completed!');
};

play();
