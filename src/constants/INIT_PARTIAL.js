/* @flow */
type Partial = {
  id: number,
  startTime: number,
  endTime: number,
  timecode: Array<number>,
  amps: Array<number>,
  freqs: Array<number>
};

const INIT_PARTIAL: Partial = {
  id: 0,
  startTime: 0,
  endTime: 0,
  timecode: [],
  freqs: [],
  amps: []
};

export default INIT_PARTIAL;
