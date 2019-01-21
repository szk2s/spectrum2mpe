const utils = require('./utils');

function partials2melodies(_partials) {
  return new Promise((resolve) => {
    console.log('Generating melody lines from partials...');

    const partials = [..._partials];

    //normalize amplitudes
    utils.normalize(partials);

    const melodies = partials.map((partial) => {
      const melody = {
        id: partial.id,
        numFrames: partial.numFrames,
        startTime: partial.startTime,
        endTime: partial.endTime,
        amps: partial.amps,
        timecode: partial.timecode
      };
      melody.noteOnOffs = detectNoteOnNoteOffIndices(partial.amps);
      [
        melody.activeNoteNums,
        melody.deltaCents
      ] = convertFreq2MidiNoteNumAndDeltaCent(partial.freqs, melody.noteOnOffs);
      return melody;
    });
    resolve(melodies);

    // define subfunctions
    function detectNoteOnNoteOffIndices(amps) {
      const [NOTE_ON, NOTE_OFF, NOTHING] = [1, -1, 0];
      return amps.map((amp, idx, amps) => {
        const prevAmp = amps[idx - 1];
        if (idx == 0) {
          if (amp > 0) {
            return NOTE_ON;
          }
          return NOTHING;
        }
        if (amp > 0 && prevAmp == 0) {
          return NOTE_ON;
        }
        if (amp == 0 && prevAmp > 0) {
          return NOTE_OFF;
        }
        return NOTHING;
      });
    }

    function convertFreq2MidiNoteNumAndDeltaCent(freqs = [], noteOnOffs = []) {
      const floatNoteNums = freqs.map((freq) => utils.ftom(freq));
      const closestNoteNums = floatNoteNums.map((floatNoteNum) =>
        Math.round(floatNoteNum)
      );
      const midiNoteNums = noteOnOffs.reduce(
        (midiNoteNums, noteOnOff, idx, noteOnOffs) => {
          const prevNoteOnOff = noteOnOffs[idx - 1];
          const closestNoteNum = closestNoteNums[idx];
          const prevMidiNoteNum = midiNoteNums[midiNoteNums.length - 1];
          const [NOTE_ON, NOTE_OFF, NOTHING] = [1, -1, 0];
          if (noteOnOff === NOTE_ON) {
            midiNoteNums.push(closestNoteNum);
          } else if (noteOnOff === NOTE_OFF) {
            midiNoteNums.push(prevMidiNoteNum);
          } else if (noteOnOff === NOTHING) {
            if (prevNoteOnOff == null || prevNoteOnOff === -1) {
              midiNoteNums.push(null);
            } else {
              midiNoteNums.push(prevMidiNoteNum);
            }
          } else {
            throw new Error('bad noteOnOff data ' + noteOnOff);
          }
          return midiNoteNums;
        },
        []
      );
      const deltaCents = midiNoteNums.map((midiNoteNum, idx) => {
        if (midiNoteNums) {
          return (floatNoteNums[idx] - midiNoteNum) * 100;
        } else {
          return null;
        }
      });
      return [midiNoteNums, deltaCents];
    }
  });
}

module.exports = partials2melodies;
