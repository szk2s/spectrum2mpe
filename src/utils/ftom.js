const ftom = (freq) => {
  // Convert frequency to the mathmatically correct MIDI note number (Float Number, Not Integer)

  const noteNum = 12 * getBaseLog(2, freq / 440) + 69;
  if (noteNum < 0) {
    return 0;
  }
  if (noteNum > 127) {
    return 127;
  }
  return noteNum;

  function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }
};

export default ftom;
