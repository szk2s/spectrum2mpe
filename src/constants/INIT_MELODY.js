/* @flow */
import { NOTE_STATUS } from '../constants';

type Melody = {
  id: number,
  startTime: number,
  endTime: number,
  timecode: Array<number>,
  amps: Array<number>,
  noteOnOffs: Array<$Values<typeof NOTE_STATUS>>,
  midiNoteNums: Array<number | null>,
  deltaCents: Array<number | null>
};

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
