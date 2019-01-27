/* @flow */
import { NOTE_STATUS } from '../constants';

const INIT_MELODY: Melody = {
  id: 0,
  startTime: 0,
  endTime: 0,
  amps: [],
  timecode: [],
  noteOnOffs: [],
  midiNoteNums: [],
  deltaCents: []
};

export default INIT_MELODY;
