const max = (lst) => {
  if (!Array.isArray(lst)) {
    throw new Error('argument of max must be array');
  }
  let result = lst[0],
    i,
    length = lst.length;
  for (i = 0; i < length; i++) {
    if (lst[i] > result) {
      result = lst[i];
    }
  }
  return result;
};

module.exports = {
  collectSMFs: (smfs) => {
    const initialValue = {
      ppqn: smfs[0].ppqn,
      type: smfs[0].type,
      tracks: []
    };
    const collectedSMFs = smfs.reduce((collection, smf) => {
      if (collection.ppqn !== smf.ppqn) {
        throw new Error('All SMFs must have exactly the same ppqn');
      }
      if (collection.type !== smf.type) {
        throw new Error('All SMFs must have exactly the same file type');
      }
      collection.tracks.push(...smf);
      return collection;
    }, initialValue);
    return collectedSMFs;
  },

  normalize: function(partials) {
    const allAmps = [];
    let i,
      length = partials.length;
    for (i = 0; i < length; i++) {
      allAmps.push(...partials[i].amps);
    }
    const ratio = 1 / max(allAmps);
    for (i = 0; i < length; i++) {
      partials[i].amps = partials[i].amps.map((amp) => amp * ratio);
    }
  },

  ftom: function(freq) {
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
  },

  second2Tick: function(second, bpm, ppqn) {
    const tick = (second / 60.0) * bpm * ppqn;
    return Math.round(tick);
  },

  create2DArray: function(rows) {
    var arr = [];
    for (var i = 0; i < rows; i++) {
      arr[i] = [];
    }
    return arr;
  },

  calcPitchBend: function(deltaCent, pitchBendRange) {
    // Pitchbend message is 14-bit value that has a range from 0 to 16,383.
    // For example, if we receive a MIDI message “224 120 95” that means “pitchbend on channel 1 with a coarse setting of 95 and a fine resolution of 120 (i.e., 120/128 of the way from 95 to 96)”.
    // a pitchbend value of 8192 (MSB of 64 and LSB of 0) means no bend.
    // pitchbendValue = (msb * 128) + lsb

    const pitchBendValue = (deltaCent / 100 / pitchBendRange) * 8192;
    const msb = Math.floor(pitchBendValue / 128) + 64;
    const lsb = Math.round(pitchBendValue - (msb - 64) * 128);
    return [lsb, msb];
  },

  sum: function(nums) {
    const result = nums.reduce((prev, current) => {
      return prev + current;
    });
    return result;
  },

  average: function(nums) {
    const sum = nums.reduce((prev, current) => {
      return prev + current;
    });
    return sum / nums.length;
  }
};
