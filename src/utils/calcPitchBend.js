/* @flow */
const calcPitchBend = (deltaCent: number, pitchBendRange: number): Array<number> => {
  // Pitchbend message is 14-bit value that has a range from 0 to 16,383.
  // For example, if we receive a MIDI message “224 120 95” that means “pitchbend on channel 1 with a coarse setting of 95 and a fine resolution of 120 (i.e., 120/128 of the way from 95 to 96)”.
  // a pitchbend value of 8192 (MSB of 64 and LSB of 0) means no bend.
  // pitchbendValue = (msb * 128) + lsb

  const pitchBendValue = (deltaCent / 100 / pitchBendRange) * 8192;
  const msb = Math.floor(pitchBendValue / 128) + 64;
  const lsb = Math.round(pitchBendValue - (msb - 64) * 128);
  return [lsb, msb];
};

export default calcPitchBend;
