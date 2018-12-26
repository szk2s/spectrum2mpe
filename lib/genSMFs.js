const utils = require('./utils');
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
const _ = require('lodash');

function genSMFs(
    _melodies,
    _songName = 'untitled', 
    _option = {
        ppqr: 48,   // ticks per quarter note
        bpm: 120,
        pitchBendRange: 48,
        defaultVelocity: 30
    }
){
    return new Promise((resolve, reject) => {
        // define subfunctions
        const addNoteMsgs = (melody, track, ch) => {
            melody.noteOnOffs.forEach((noteOnOff, frameIdx) => {
                switch(noteOnOff){
                case 1 :
                    track.add(
                        utils.second2Tick(melody.timecode[frameIdx], bpm, ppqr), 
                        new JZZ.MIDI.noteOn(ch, melody.activeNoteNums[frameIdx], defaultVelocity) 
                    );
                    break;
                case -1 : 
                    track.add(
                        utils.second2Tick(melody.timecode[frameIdx], bpm, ppqr), 
                        new JZZ.MIDI.noteOff(ch, melody.activeNoteNums[frameIdx])
                    );
                    break;
                default :
                    break;
                }
            });
        };
        
        const addPitchBendMsgs = (melody, track, ch) => {
            melody.deltaCents.forEach((deltaCent, frameIdx) => {
                if (melody.activeNoteNums[frameIdx]){
                    let byte2; let byte3;
                    [byte2, byte3] = utils.calcPitchBend(deltaCent, pitchBendRange);
                    let byte1 = '0x' + (ch+224).toString(16).toUpperCase();
                    track.add(
                        utils.second2Tick(melody.timecode[frameIdx], bpm, ppqr), 
                        new JZZ.MIDI([byte1, byte2, byte3])
                    );
                }
            });
        };
        
        const addPressureMsgs = (melody, track, ch) => {
            melody.amps.forEach((amp, frameIdx) => {
                if (melody.activeNoteNums[frameIdx]){
                    track.add(
                        utils.second2Tick(melody.timecode[frameIdx], bpm, ppqr), 
                        new JZZ.MIDI.pressure(ch, Math.floor(amp*127))
                    );
                }
            });
        };

        const addMelodyToTrack = (melody, track, ch) => {
            addNoteMsgs(melody, track, ch);
            addPitchBendMsgs(melody, track, ch);
            addPressureMsgs(melody, track, ch);
        };
        
        const calcEndTime = oneBunchOfMelodies => {
            const endTimes = oneBunchOfMelodies.map(melody => melody.endTime);
            return Math.max(...endTimes);
        };

        // Main

        const melodies = [..._melodies];
        const defaultOption = {
            ppqr: 48,   // ticks per quarter note
            bpm: 120,
            pitchBendRange: 48,
            defaultVelocity: 30
        };
        const {bpm, ppqr, pitchBendRange, defaultVelocity} = _.merge(defaultOption, _option);

        console.log('generating SMFs...');
        melodies.sort((melodyA, melodyB) => utils.average(melodyB.amps) - utils.average(melodyA.amps));

        // bundle melodies into bunches of 15 melodies
        const bunchesOfMelodies = [];
        while (melodies.length > 0){
            bunchesOfMelodies.push(melodies.splice(0,15));
        }
        
        const totalTracksNum = bunchesOfMelodies.length;
        // generates track (MTrk) 
        const tracks = new Array(totalTracksNum);
        for (let i = 0; i < totalTracksNum; i = (i+1)) {
            console.log('generating track ' + (i + 1) + ' (Total ' + totalTracksNum + ' tracks)');
            const track = new JZZ.MIDI.SMF.MTrk;
            if(totalTracksNum === 1){
                track.add(0, JZZ.MIDI.smfSeqName(_songName));
            }else{
                track.add(0, JZZ.MIDI.smfSeqName(_songName + '-' + (i+1)));
            }
            track.add(0, JZZ.MIDI.smfBPM(bpm));

            //add melody into track
            for (let j = 0; j < bunchesOfMelodies[i].length ; j = (j+1)){
                // console.log('generating channel ' + (j + 1) +  ' of track ' + (i + 1))
                if(j > 15){
                    throw new Error('bad melodyIdx');
                }
                addMelodyToTrack(bunchesOfMelodies[i][j], track, j+1);
            }

            // add endtime into track
            const endTime = calcEndTime(bunchesOfMelodies[i]); 
            track.add(
                utils.second2Tick(endTime, bpm, ppqr) + ppqr, 
                new JZZ.MIDI.smfEndOfTrack()
            );

            tracks[i] = track;
        } 
        
        const smfs = new Array();

        while (tracks.length > 0){
            const smf = new JZZ.MIDI.SMF(1, ppqr); // type 0 or 1
            smf.push(...tracks.splice(0,16));
            smfs.push(smf);
        }

        resolve(smfs);
    });
}

module.exports = genSMFs;