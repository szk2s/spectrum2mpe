const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
import { collectSMFs } from './utils';

const smfPlay = (smf, portIdx) =>
  new Promise((resolve) => {
    const midiout = JZZ().openMidiOut(portIdx);
    const player = smf.player();
    player.connect(midiout);
    player.play();
    resolve();
  });

const smfsMultiPlay = (smfs = [], portIdxes = [0]) =>
  new Promise((resolve) => {
    const collectedSMFs = collectSMFs(smfs);

    if (collectedSMFs.tracks.length > portIdxes.length) {
      throw new Error('The number of ports is insufficient to play all tracks');
    }

    collectedSMFs.tracks.forEach((track, trackIdx) => {
      const tmpSMF = new JZZ.MIDI.SMF(collectedSMFs.type, collectedSMFs.ppqn);
      tmpSMF.push(track);
      smfPlay(tmpSMF, portIdxes[trackIdx]);
    });
    resolve();
  });

const outputPorts = () => {
  return JZZ().info().outputs;
};

const refreshPorts = JZZ.refresh;

export { smfPlay, smfsMultiPlay, outputPorts, refreshPorts };
