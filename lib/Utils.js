module.exports = {
    normalize : function (array){
        const ratio = Math.max(...array) / 1;
        const results = array.map(v => v / ratio);
        return results;
    },

    test : function (){
        return 'hello'
    },

    detectNoteOnNoteOffIndices : function (array){
        const result = [];
        // 'note on' = 1, 'note off' = -1, 'nothing' = 0
        array.forEach((val, idx, array) => {
            if(idx == 0){
                if (val>0) result.push(1);
                else result.push(0);
            }else if(val>0 && array[idx-1]==0){
                result.push(1);
            }else if(val==0 && array[idx-1]>0){
                result.push(-1);
            }else{
                result.push(0);
            }
        });
        return result;
    },

    ftom : function (freq){
        // Convert frequency to the mathmatically correct MIDI note number (Float Number Not Integer)
        const noteNum = 12 * getBaseLog(2, freq/440)+69
        return noteNum

        function getBaseLog(x, y) {
            return Math.log(y) / Math.log(x);
        }          
    },

    secondToTick : function (second, bpm, ppqr){
        const tick = second / 60.0 * bpm * ppqr;
        return Math.round(tick);
    },

    create2DArray : function (rows){
        var arr = [];
        for (var i=0;i<rows;i++) {
           arr[i] = [];
        }      
        return arr;
    },

    calcPitchBend : function (destFreq, noteNum, pitchBendRange){
        // Pitchbend message is 14-bit value that has a range from 0 to 16,383.
        // For example, if we receive a MIDI message “224 120 95” that means “pitchbend on channel 1 with a coarse setting of 95 and a fine resolution of 120 (i.e., 120/128 of the way from 95 to 96)”.
        // a pitchbend value of 8192 (MSB of 64 and LSB of 0) means no bend.
        // pitchbendValue = (msb * 128) + lsb

        const destNN = this.ftom(destFreq);
        const pitchBendValue = (destNN-noteNum) / pitchBendRange * 8192;
        const msb = Math.floor(pitchBendValue/128) + 64;
        const lsb = Math.round(pitchBendValue - (msb-64)*128);
        return [lsb, msb]
    }
}