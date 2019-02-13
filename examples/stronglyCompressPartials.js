const s2m = require('..');
const moment = require('moment');
const _ = require('lodash');
const { FREQ_LIMIT } = s2m;

const compress = async () => {
  const partials = await s2m.txtImport(__dirname + '/assets/txt/cricket_pulse_1.txt');
  // filter some partials which is out of frequency range.
  const filteredPartials = partials.filter((partial) => {
    const meanFreq = _.mean(partial.freqs);
    return FREQ_LIMIT.LOW < meanFreq && meanFreq < FREQ_LIMIT.HIGH;
  });
  await s2m.fillBlankTime(filteredPartials);
  // compress 135 partials into 15 partials.
  const compressedPartials = await s2m.extractPeakFreqs(filteredPartials, 15);
  const melodies = await s2m.partials2melodies(compressedPartials);
  const smfs = await s2m.genSMFs(melodies, 'cricket_pulse_1', {
    pitchBendRange: 127
  });
  await s2m.smfsBatchExport(smfs, 'cricket_pulse_1', __dirname + '/output', {
    makeOutputFolder: true,
    outputFolderName: moment(new Date()).format('YYMMDD')
  });
  console.log('Completed!');
};

compress();
