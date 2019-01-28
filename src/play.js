/* @flow */
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
import { collectSMFs } from './utils';

const smfPlay = (smf: any, portIdx: number): Promise<void> =>
  new Promise((resolve) => {
    const midiout = JZZ().openMidiOut(portIdx);
    const player = smf.player();
    player.connect(midiout);
    player.play();
    resolve();
  });

const smfsMultiPlay = (smfs: Array<any> = [], portIdxes: Array<number> = [0]): Promise<void> =>
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

const outputPorts = (): Array<Port> => {
  return JZZ().info().outputs;
};

type Port = {
  name: string,
  manufacturer: string,
  version: string,
  engine: string
};

const refreshPorts = JZZ.refresh;

export { smfPlay, smfsMultiPlay, outputPorts, refreshPorts };
