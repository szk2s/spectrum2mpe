/* @flow */
import { normalize, ftom } from './utils';
import { NOTE_STATUS, INIT_MELODY, INIT_PARTIAL } from './constants';
type Melody = typeof INIT_MELODY;
type Partial = typeof INIT_PARTIAL;

const partials2melodies = (_partials: Array<Partial>): Promise<Array<Melody>> => {
  return new Promise((resolve) => {
    console.log('Generating melody lines from partials...');

    const partials: Array<Partial> = [..._partials];

    //normalize amplitudes
    normalize(partials);

    const melodies = partials.map((partial) => {
      const melody: Melody = {
        id: partial.id,
        startTime: partial.startTime,
        endTime: partial.endTime,
        amps: partial.amps,
        timecode: partial.timecode,
        noteOnOffs: [],
        midiNoteNums: [],
        deltaCents: []
      };
      melody.noteOnOffs = detectNoteOnNoteOffIndices(partial.amps);
      const { midiNoteNums, deltaCents } = convertFreq2MidiNoteNumAndDeltaCent(partial.freqs, melody.noteOnOffs);
      melody.midiNoteNums.push(...midiNoteNums);
      melody.deltaCents.push(...deltaCents);
      return melody;
    });
    resolve(melodies);

    // define subfunctions
    function detectNoteOnNoteOffIndices(amps: Array<number>): Array<$Values<typeof NOTE_STATUS>> {
      return amps.map((amp, idx, amps) => {
        const prevAmp = amps[idx - 1];
        if (idx == 0) {
          if (amp > 0) {
            return NOTE_STATUS.ON;
          }
          return NOTE_STATUS.NO_EVENT;
        }
        if (amp > 0 && prevAmp == 0) {
          return NOTE_STATUS.ON;
        }
        if (amp == 0 && prevAmp > 0) {
          return NOTE_STATUS.OFF;
        }
        return NOTE_STATUS.NO_EVENT;
      });
    }

    function convertFreq2MidiNoteNumAndDeltaCent(freqs = [], noteOnOffs = []) {
      const floatNoteNums = freqs.map((freq) => ftom(freq));
      const closestNoteNums = floatNoteNums.map((floatNoteNum) => Math.round(floatNoteNum));
      const midiNoteNums = noteOnOffs.map(Number).reduce((midiNoteNums, noteOnOff, idx, noteOnOffs) => {
        const prevNoteOnOff = noteOnOffs[idx - 1];
        const closestNoteNum = closestNoteNums[idx];
        const prevMidiNoteNum = midiNoteNums[midiNoteNums.length - 1];
        const [NOTE_ON, NOTE_OFF, NOTHING] = [1, -1, 0];
        if (noteOnOff === NOTE_ON) {
          midiNoteNums.push(closestNoteNum);
        } else if (noteOnOff === NOTE_OFF) {
          // You need prevMidiNoteNum to make note off message.
          // Midi Note Off message is like [1stByte, 2ndByte, 3rdByte] = [ midiCh + 127, prevMidiNoteNum (0 to 127), velocity (0)];
          // Be aware you should add null to following index.
          midiNoteNums.push(prevMidiNoteNum);
        } else if (noteOnOff === NOTHING) {
          switch (prevNoteOnOff) {
            case NOTE_ON:
              midiNoteNums.push(prevMidiNoteNum);
              break;
            case NOTE_OFF:
              midiNoteNums.push(null);
              break;
            case NOTHING:
              midiNoteNums.push(prevMidiNoteNum);
              break;
          }
        } else {
          midiNoteNums.push(midiNoteNums[midiNoteNums.length - 1]);
        }
        return midiNoteNums;
      }, []);
      const deltaCents = midiNoteNums.map((midiNoteNum, idx) => {
        if (midiNoteNum) {
          return (floatNoteNums[idx] - midiNoteNum) * 100;
        } else {
          return null;
        }
      });
      return { midiNoteNums, deltaCents };
    }
  });
};

export default partials2melodies;
