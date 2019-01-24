const s2m = require('..');
const moment = require('moment');
const _ = require('lodash');
const { HIGH_FREQ_LIMIT, LOW_FREQ_LIMIT } = s2m.constants;

const compress = async () => {
  const partials = await s2m.jsonImport(__dirname + '/assets/json/bird.json');
  // filter some partials which is out of frequency range.
  const filteredPartials = partials.filter((partial) => {
    const meanFreq = _.mean(partial.freqs);
    return LOW_FREQ_LIMIT < meanFreq && meanFreq < HIGH_FREQ_LIMIT;
  });
  // compress 135 partials into 15 partials.
  const compressedPartials = await s2m.extractPeakFreqs(filteredPartials, 15);
  const melodies = await s2m.partials2melodies(compressedPartials);
  const smfs = await s2m.genSMFs(melodies, 'test-song', {
    pitchBendRange: 127
  });
  await s2m.smfsBatchExport(smfs, 'bird', __dirname + '/output', {
    makeOutputFolder: true,
    outputFolderName: moment(new Date()).format('YYMMDD')
  });
  console.log('Completed!');
};

compress();
