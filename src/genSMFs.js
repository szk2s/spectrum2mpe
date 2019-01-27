import { average, calcPitchBend, second2tick } from './utils';
import _ from 'lodash';
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

const genSMFs = (
  _melodies,
  _songName = 'untitled',
  _option = {
    ppqn: 48, // ticks per quarter note
    bpm: 120,
    pitchBendRange: 48,
    defaultVelocity: 30
  }
) => {
  return new Promise((resolve) => {
    const melodies = [..._melodies];
    const defaultOption = {
      ppqn: 48, // ticks per quarter note
      bpm: 120,
      pitchBendRange: 48,
      defaultVelocity: 30
    };
    const { bpm, ppqn, pitchBendRange, defaultVelocity } = _.merge(defaultOption, _option);

    console.log('generating SMFs...');
    melodies.sort((melodyA, melodyB) => average(melodyB.amps) - average(melodyA.amps));

    // bundle melodies into bunches of 15 melodies
    const bunchesOfMelodies = [];
    while (melodies.length > 0) {
      bunchesOfMelodies.push(melodies.splice(0, 15));
    }

    const totalTracksNum = bunchesOfMelodies.length;
    // generates track (MTrk)
    const tracks = bunchesOfMelodies.reduce((tracks, oneBunchOfMelodies, trackIdx) => {
      console.log('generating track ' + (trackIdx + 1) + ' (Total ' + totalTracksNum + ' tracks)');
      const track = new JZZ.MIDI.SMF.MTrk();
      if (totalTracksNum === 1) {
        track.add(0, JZZ.MIDI.smfSeqName(_songName));
      } else {
        track.add(0, JZZ.MIDI.smfSeqName(_songName + '-' + (trackIdx + 1)));
      }
      track.add(0, JZZ.MIDI.smfBPM(bpm));

      //add melody into track
      oneBunchOfMelodies.forEach((melody, melodyIdx) => {
        // console.log('generating channel ' + (ch + 1) +  ' of track ' + (trackIdx + 1))
        if (melodyIdx > 15) {
          throw new Error('bad melodyIdx');
        }
        addMelodyToTrack(melody, track, melodyIdx + 1);
      });

      // add endtime into track
      const endTime = calcEndTime(oneBunchOfMelodies);
      track.add(second2tick(endTime, bpm, ppqn) + ppqn, new JZZ.MIDI.smfEndOfTrack());

      tracks.push(track);
      return tracks;
    }, []);

    const smfs = [];
    while (tracks.length > 0) {
      const smf = new JZZ.MIDI.SMF(1, ppqn); // type 0 or 1
      smf.push(...tracks.splice(0, 16));
      smfs.push(smf);
    }
    resolve(smfs);

    // define subfunctions
    function addMelodyToTrack(melody, track, ch) {
      addNoteMsgs(melody, track, ch);
      addPitchBendMsgs(melody, track, ch);
      addPressureMsgs(melody, track, ch);
    }

    function addNoteMsgs(melody, track, ch) {
      melody.noteOnOffs.forEach((noteOnOff, frameIdx) => {
        switch (noteOnOff) {
          case 1:
            track.add(
              second2tick(melody.timecode[frameIdx], bpm, ppqn),
              new JZZ.MIDI.noteOn(ch, melody.midiNoteNums[frameIdx], defaultVelocity)
            );
            break;
          case -1:
            track.add(
              second2tick(melody.timecode[frameIdx], bpm, ppqn),
              new JZZ.MIDI.noteOff(ch, melody.midiNoteNums[frameIdx])
            );
            break;
          default:
            break;
        }
      });
    }

    function addPitchBendMsgs(melody, track, ch) {
      melody.deltaCents.forEach((deltaCent, frameIdx) => {
        if (melody.midiNoteNums[frameIdx]) {
          let byte2;
          let byte3;
          [byte2, byte3] = calcPitchBend(deltaCent, pitchBendRange);
          let byte1 = '0x' + (ch + 224).toString(16).toUpperCase();
          track.add(second2tick(melody.timecode[frameIdx], bpm, ppqn), new JZZ.MIDI([byte1, byte2, byte3]));
        }
      });
    }

    function addPressureMsgs(melody, track, ch) {
      melody.amps.forEach((amp, frameIdx) => {
        if (melody.midiNoteNums[frameIdx]) {
          track.add(
            second2tick(melody.timecode[frameIdx], bpm, ppqn),
            new JZZ.MIDI.pressure(ch, Math.floor(amp * 127))
          );
        }
      });
    }

    function calcEndTime(oneBunchOfMelodies) {
      const endTimes = oneBunchOfMelodies.map((melody) => melody.endTime);
      return Math.max(...endTimes);
    }
  });
};

export default genSMFs;
