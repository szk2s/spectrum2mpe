const utils = require('./utils');

function partials2melodies(_partials){
    return new Promise((resolve, reject) => {
        console.log('Generating melody lines from partials...');

        const partials = Object.assign([], _partials);

        //normalize amplitudes
        utils.normalize(partials);

        const melodies = partials.map(partial => {
            const melody = {
                id: partial.id,
                numFrames: partial.numFrames,
                startTime: partial.startTime,
                endTime: partial.endTime,
                amps: partial.amps,
                timecode: partial.timecode
            };
            melody.noteOnOffs = detectNoteOnNoteOffIndices(partial.amps);
            [melody.activeNoteNums, melody.deltaCents] = calcActiveNoteNums(partial.freqs, melody.noteOnOffs);
            return melody;
        });
        resolve(melodies);

        // define subfunctions
        function detectNoteOnNoteOffIndices(amps){
            const result = [];
            // 'note on' = 1, 'note off' = -1, 'nothing' = 0
            amps.forEach((amp, idx, amps) => {
                if(idx == 0){
                    if (amp>0) result.push(1);
                    else result.push(0);
                }else if(amp>0 && amps[idx-1]==0){
                    result.push(1);
                }else if(amp==0 && amps[idx-1]>0){
                    result.push(-1);
                }else{
                    result.push(0);
                }
            });
            return result;
        }

        function calcActiveNoteNums(freqs, noteOnOffs){
            const floatNoteNums = freqs.map(freq => utils.ftom(freq));
            const closestNoteNums = floatNoteNums.map(floatNoteNum => Math.round(floatNoteNum));
            const activeNoteNums = noteOnOffs.reduce((activeNoteNums, noteOnOff, idx, noteOnOffs) => {
                if (noteOnOff === 1){
                    activeNoteNums.push(closestNoteNums[idx]);
                } else if (noteOnOff === -1){
                    activeNoteNums.push(activeNoteNums[activeNoteNums.length-1]);
                } else if (noteOnOff === 0){
                    if(typeof noteOnOffs[idx-1] === 'undefined' || noteOnOffs[idx-1] === -1){
                        activeNoteNums.push(null);
                    }else{
                        activeNoteNums.push(activeNoteNums[activeNoteNums.length-1]);
                    }
                }else{
                    throw new Error('bad noteOnOff data ' + noteOnOff);
                }
                return activeNoteNums;
            }, []);
            const deltaCents = activeNoteNums.map((activeNoteNum, idx) => {
                if(activeNoteNums){
                    return (floatNoteNums[idx] - activeNoteNum) * 100;
                }else{
                    return null;
                }
            });
            return [activeNoteNums, deltaCents];
        }

    });
}

module.exports = partials2melodies;