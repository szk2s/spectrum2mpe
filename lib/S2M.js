const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const utils = require('./utils/utils');
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
const osc = require('node-osc');
const moment = require('moment');
const defaultConfig = require('../defaultConfig');

class S2M {
    constructor(environmentConfig){
        S2M.hasInstance = true;
        this.config = _.merge(defaultConfig, environmentConfig);
    }

    static build(environmentConfig){
        if ( !S2M.hasInstance ) {
            const s2m = new S2M(environmentConfig);
            return s2m;
        }
        throw new Error("S2M already has an instance");
    }

    async convertFromSpear(songName){
        const partials = await this.txtImport(songName);
        const melodies = await this.partials2melodies(partials);
        const smfs = await this.genSMFs(melodies, songName);
        this.smfsBatchExport(smfs, songName);
    }

    async convertFromMatlab(songName){
        let data;
        data = await this.csvImport(songName);
        // this.oscSend(data);
        data = await this.analyse(data);
        data = await this.smfGenerate(data);
        data = await this.addMasterChannelCC(data);
        data = await this.smfPlay(data);
        await this.smfExport(data, songName);
    }

    csvImport(songName){
        return new Promise((resolve, reject) => {
            console.log('Importing files...')
            // load csv files and parse matrix into array 
            const data = {};

            const inputFreqsFilepath = path.join(this.config.directories.assets , '/csv' , songName + '_freqs.csv');
            const inputAmpsFilepath = path.join(this.config.directories.assets , '/csv' , songName + '_amps.csv');
            const inputTimecodeFilepath = path.join(this.config.directories.assets , '/csv' , songName + '_timecode.csv');
            const inputEnvFilepath = path.join(this.config.directories.assets , '/csv' , songName + '_env.csv');

            data.freqs = parseCSV(inputFreqsFilepath);
            data.amps = parseCSV(inputAmpsFilepath);
            data.timecode = parseCSV(inputTimecodeFilepath);
            data.env = parseCSV(inputEnvFilepath);
            data.amps = data.amps.map(item => utils.normalize(item));     //normalize amplitudes
            resolve(data);
        })

        function parseCSV(filepath){
            let array = fs.readFileSync(filepath).toString().split("\n");
            if (array[array.length-1] == ""){array.pop();}
            for(let i in array) {
                array[i]=array[i].split(",").map(Number);
            }
            return array
        }
    }

    txtImport(songName){
        return new Promise((resolve, reject) => {
            console.log('Importing files...')
            //load txt files (exported by spear)
            const inputFilepath = path.join(this.config.directories.assets , '/txt' , songName + '.txt');
            const text = fs.readFileSync(inputFilepath).toString();
            const partials = this.parseText(text);
            resolve(partials);
        })
    }

    parseText(text){
        const textArray = text.split('\n');
        if (textArray[textArray.length-1] == ""){textArray.pop();};

        const partials = textArray.reduce((partials, stringData, idx)=> {
            const floatArray = stringData.split(/\s+/).map(item => Number(item));
            if(Number.isNaN(floatArray[0])){
                return partials;
            }else if(idx%2 === 0){
                partials.push({ 
                    id : floatArray[0],
                    numFrames : floatArray[1],
                    startTime : floatArray[2],
                    endTime : floatArray[3]
                })
                return partials;
            }else if(idx%2 === 1){
                partials[partials.length - 1].timecode = floatArray.filter((_, idx) => idx%3===0);
                partials[partials.length - 1].freqs = floatArray.filter((_, idx) => idx%3===1);
                partials[partials.length - 1].amps = floatArray.filter((_, idx) => idx%3===2);
                return partials;
            }else{
                return partials;
            }
        },[]);

        return partials;
    }

    partials2melodies(partials){
        return new Promise((resolve, reject) => {
            console.log('Generating melody lines from partials...');
            const melodies = partials.map(partial => {
                const melody = {
                    id : partial.id,
                    numFrames : partial.numFrames,
                    startTime : partial.startTime,
                    endTime : partial.endTime,
                    amps : partial.amps,
                    timecode : partial.timecode
                };
                melody.noteOnOffs = this.detectNoteOnNoteOffIndices(partial.amps);
                [melody.activeNoteNums, melody.deltaCents] = this.calcActiveNoteNums(partial.freqs, melody.noteOnOffs);
                return melody;
            })
            resolve(melodies)
        })
    }

    detectNoteOnNoteOffIndices(amps){
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

    calcClosestNoteNums(freqs){
        const floatNoteNums = freqs.map(freq => utils.ftom(freq));
        const closestNoteNums = floatNoteNums.map(floatNoteNum => Math.round(floatNoteNum))
        const deltaCents = floatNoteNums.map((floatNoteNum, idx) => (floatNoteNum - closestNoteNums[idx]) * 100);
        return [closestNoteNums, deltaCents];
    }

    calcActiveNoteNums(freqs, noteOnOffs){
        const floatNoteNums = freqs.map(freq => utils.ftom(freq));
        const closestNoteNums = floatNoteNums.map(floatNoteNum => Math.round(floatNoteNum));
        const activeNoteNums = noteOnOffs.reduce((activeNoteNums, noteOnOff, idx, noteOnOffs) => {
            if (noteOnOff === 1){
                activeNoteNums.push(closestNoteNums[idx]);
            } else if (noteOnOff === -1){
                activeNoteNums.push(activeNoteNums[activeNoteNums.length-1]);
            } else if (noteOnOff === 0){
                if(noteOnOffs[idx-1] === -1){
                    activeNoteNums.push(null);
                }else{
                    activeNoteNums.push(activeNoteNums[activeNoteNums.length-1]);
                }
            }else{
                throw new Error("bad noteOnOff data " + noteOnOff)
            }
            return activeNoteNums;
        }, []);
        const deltaCents = activeNoteNums.map((activeNoteNum, idx) => {
            if(activeNoteNums){
                return (floatNoteNums[idx] - activeNoteNum) * 100;
            }else{
                return null;
            }
        })
        return [activeNoteNums, deltaCents];
    }

    analyse(data){
        return new Promise((resolve, reject) => {
            console.log('Analysing data...');
            data.noteOnOff= [];
            data.quantizedNoteNum = [];
            data.timecode = data.freqs[0].map((x, idx) => idx);
            data.amps.forEach((item) => {
                data.noteOnOff.push(utils.detectNoteOnNoteOffIndices(item));
            });
            data.freqs.forEach((item) =>{
                const result = item.map(x => Math.round(utils.ftom(x)));
                data.quantizedNoteNum.push(result);
            });
            resolve(data)
        })
    }

    addMasterChannelCC(data){
        return new Promise((resolve, reject) => {
            console.log('Now processing 1ch as a master channel...');
            const trk = data.smf[0];
            addSlideCC(this.config.slideCC);
            data.smf[0] = trk;
            resolve(data)

            function addSlideCC(ccNum){
                data.env[0].forEach((val, idx) => {
                    let msg = JZZ.MIDI.control(0, ccNum, Math.round(val*127));
                    trk.add(data.timecode[idx], msg);                    
                });
            }
        })
    }

    oscSend(data){
        return new Promise((resolve, reject) => {
            const ip = this.config.oscClient.ip;
            const port = this.config.oscClient.port;
            const client = new osc.Client(ip, port);

            console.log('Send OSC message to');
            console.log('IP : ' + ip + ', Port : ' + port)
            
            trigger();  //  Normal Mode
            // setInterval(trigger, 8300);  //  Loop Mode
            
            resolve(data)

            function trigger(){
                for(let i in data.timecode[0]){
                    setTimeout(sendOSC, data.timecode[0][i]*1000, i);
                }
            }

            function sendOSC(i){
                let freqMsg = [];
                let ampMsg = [];
                for (let j in data.freqs){
                        freqMsg.push(data.freqs[j][i]);
                        ampMsg.push(data.amps[j][i]);
                }
                client.send('/frequency', freqMsg);
                console.log("/frequency " + freqMsg);
                client.send('/amplitude', ampMsg);
                console.log("/amplitude " + ampMsg);
            }
        })
    }

    genSMFs(melodies, songName){
        return new Promise((resolve, reject) => {
            console.log('generating SMFs...')
            melodies.sort((melodyA, melodyB) => utils.average(melodyB.amps) - utils.average(melodyA.amps));

            // bundle melodies into bunches of 15 melodies
            const bunchesOfMelodies = [];
            while (melodies.length > 0){
                bunchesOfMelodies.push(melodies.splice(0,15));
            }
            
            const totalTracks = bunchesOfMelodies.length;
            // generates track (MTrk) 
            const tracks = bunchesOfMelodies.reduce((tracks, bunch, trackIdx) => { 
                console.log('generating track ' + (trackIdx + 1) + ' (Total ' + totalTracks + ' tracks)')
                const track = new JZZ.MIDI.SMF.MTrk;
                track.add(0, JZZ.MIDI.smfSeqName(songName + '-' + (trackIdx+1)))
                
                //add melody into track
                bunch.forEach((melody, ch) => {
                    // console.log('generating channel ' + (ch + 1) +  ' of track ' + (trackIdx + 1))
                    this.addMelodyToTrack(melody, track, ch);
                });

                // add endtime into track
                const endTime = this.calcEndTime(bunch); 
                track.add(
                    utils.second2Tick(endTime, this.config.bpm, this.config.ppqr) + this.config.ppqr, 
                    new JZZ.MIDI.smfEndOfTrack()
                );

                tracks.push(track);
                return tracks;
            }, [])
            
            const smfs = [];
            while (tracks.length > 0){
                const smf = new JZZ.MIDI.SMF(1, this.config.ppqr); // type 0 or 1
                smf.push(...tracks.splice(0,16))
                smfs.push(smf);
            }
            resolve(smfs);
        })
    }

    addMelodyToTrack(melody, track, ch){
        this.addNoteMsgs(melody, track, ch);
        this.addPitchBendMsgs(melody, track, ch);
        this.addPressureMsgs(melody, track, ch);
    }

    addNoteMsgs(melody, track, ch){
        melody.noteOnOffs.forEach((noteOnOff, frameIdx) => {
            switch(noteOnOff){
                case 1 :
                    track.add(
                        utils.second2Tick(melody.timecode[frameIdx], this.config.bpm, this.config.ppqr), 
                        new JZZ.MIDI.noteOn(ch, melody.activeNoteNums[frameIdx], this.config.defaultVelocity) 
                    );
                    break;
                case -1 : 
                    track.add(
                        utils.second2Tick(melody.timecode[frameIdx], this.config.bpm, this.config.ppqr), 
                        new JZZ.MIDI.noteOff(ch, melody.activeNoteNums[frameIdx])
                    );
                    break;
                default :
                    break;
            }
        })
    }

    addPitchBendMsgs(melody, track, ch){
        melody.deltaCents.forEach((deltaCent, frameIdx) => {
            if (melody.activeNoteNums[frameIdx]){
                let byte2; let byte3;
                [byte2, byte3] = utils.calcPitchBend(deltaCent, this.config.pitchBendRange);
                let byte1 = '0x' + (ch+224).toString(16).toUpperCase();
                track.add(
                    utils.second2Tick(melody.timecode[frameIdx], this.config.bpm, this.config.ppqr), 
                    new JZZ.MIDI([byte1, byte2, byte3])
                );
            }
        })
    }

    addPressureMsgs(melody, track, ch){
        melody.amps.forEach((amp, frameIdx) => {
            if (melody.activeNoteNums[frameIdx]){
                track.add(
                    utils.second2Tick(melody.timecode[frameIdx], this.config.bpm, this.config.ppqr), 
                    new JZZ.MIDI.pressure(ch, Math.floor(amp*127))
                );
            }
        });
    }

    calcEndTime(bunch){
        const endTimes = bunch.map(melody => melody.endTime);
        return Math.max(...endTimes);
    }

    smfGenerate(data){
        return new Promise((resolve, reject) => {
            console.log('Generating...');
            data.smf = new JZZ.MIDI.SMF(1, this.config.ppqr); // type 0 or 1
            let trk = new JZZ.MIDI.SMF.MTrk;
            data.smf.push(trk);
            data.activeNotes = utils.create2DArray(data.amps.length);
            
            // If the data does not use full 16ch, start adding msgs from 2nd channel. (for MPE compatibility)
            let startChannel, endChannel;
            if(data.amps.length > 15){
                startChannel = 1;
                endChannel = data.amps.length;
            }else{
                startChannel = 2;
                endChannel = data.amps.length + 1;
            }
            // add msgs in channel order
            for (let i = startChannel - 1; i < endChannel-1; i++){
                console.log("Now processing " + Number(i+1) + "ch...");
                addNoteMsgs(i, this.config.defaultVelocity);        // add noteOn and noteOff messages
                addPitchBendMsgs(i, this.config.pitchBendRange);   // add freqs to Pitchbend Messages
                addPressureMsgs(i);    // add amps to Aftertouch Messages
            }
            trk.add(0, JZZ.MIDI.smfSeqName(this.config.seqName)) 
            .add(1920, JZZ.MIDI.smfEndOfTrack()); 
            // console.log(data.smf);
            resolve(data)
        

            function addNoteMsgs(ch, defaultVelocity){
                let activeNote = null;
                data.noteOnOff[ch].forEach((val, idx) => {
                    if (val == 1) {
                        let noteNum = data.quantizedNoteNum[ch][idx];
                        let msg = JZZ.MIDI.noteOn(ch, noteNum, defaultVelocity);
                        trk.add(data.timecode[idx], msg);
                        activeNote = noteNum;
                    }else if (val == -1){
                        let msg = JZZ.MIDI.noteOff(ch, activeNote);
                        trk.add(data.timecode[idx], msg);
                        activeNote = null;
                        
                    }
                    
                    data.activeNotes[ch].push(activeNote);
                })
            }

            function addPitchBendMsgs(ch, pitchBendRange){
                data.freqs[ch].forEach((val, idx) => {
                    if (data.activeNotes[ch][idx]){
                        let byte2; let byte3;
                        [byte2, byte3] = utils.calcPitchBend(val, data.activeNotes[ch][idx], pitchBendRange);
                        let byte1 = '0x' + (ch+224).toString(16).toUpperCase();
                        let msg = new JZZ.MIDI([byte1, byte2, byte3]);
                        trk.add(data.timecode[idx], msg);
                    }
                })
            }

            function addPressureMsgs(ch){
                data.amps[ch].forEach((val, idx) => {
                    const msg = JZZ.MIDI.pressure(ch, Math.floor(val*127));
                    trk.add(data.timecode[idx], msg);
                });
            }
        })
    }

    smfPlay(data){
        return new Promise((resolve, reject) => {
            console.log('Playing...');
            let midiout = JZZ().openMidiOut(this.config.outputDeviceName);
            let player = data.smf.player();
            player.connect(midiout);
            player.play();
            resolve(data)
        })
    }

    smfExport(smf, fileName){
        return new Promise((resolve, reject) => {
            console.log('Exporting ' + fileName + ' ...');

            const date = moment(new Date()).format('YYMMDD');
            const outputDir = path.join(this.config.directories.output , date);
            if (!fs.existsSync(outputDir)){
                fs.mkdirSync(outputDir);
            }
            const outputFilepath = path.join(outputDir , fileName);
            fs.writeFileSync(outputFilepath, smf.dump(), 'binary');
            console.log(fileName + ' exported!');
            console.log('The result file is at');
            console.log(outputFilepath);
            resolve()
        })
    }

    async smfsBatchExport(smfs, songName){
        if(smfs.length == 1 ){
            await this.smfExport(smfs[0], songName + '.mid');
        }else{
            await smfs.forEach((smf, idx) => this.smfExport(smf, songName + '-' + (idx + 1) + '.mid'));
        }
        console.log('All files have been exported successfully!!');
    }
}
S2M.hasInstance = false;

module.exports = S2M;