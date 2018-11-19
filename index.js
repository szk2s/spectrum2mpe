const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const Utils = require('./lib/utils/Utils');
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
const osc = require('node-osc');
const moment = require('moment');
const defaultConfig = require('./defaultConfig');

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

    // async convertFromSpear(songName){

    // }

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
            data.amps = data.amps.map(item => Utils.normalize(item));     //normalize amplitudes
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

    analyse(data){
        return new Promise((resolve, reject) => {
            console.log('Analysing data...');
            data.noteOnOff= [];
            data.quantizedNoteNum = [];
            data.timecode = data.freqs[0].map((x, idx) => idx);
            data.amps.forEach((item) => {
                data.noteOnOff.push(Utils.detectNoteOnNoteOffIndices(item));
            });
            data.freqs.forEach((item) =>{
                const result = item.map(x => Math.round(Utils.ftom(x)));
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

    smfGenerate(data){
        return new Promise((resolve, reject) => {
            console.log('Generating...');
            data.smf = new JZZ.MIDI.SMF(1, this.config.ppqr); // type 0 or 1
            let trk = new JZZ.MIDI.SMF.MTrk;
            data.smf.push(trk);
            data.activeNotes = Utils.create2DArray(data.amps.length);
            
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
                        [byte2, byte3] = Utils.calcPitchBend(val, data.activeNotes[ch][idx], pitchBendRange);
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

    smfExport(data, songName){
        return new Promise((resolve, reject) => {
            console.log('Exporting...');

            const date = moment(new Date()).format('YYMMDD');
            const outputDir = path.join(this.config.directories.output , date);
            if (!fs.existsSync(outputDir)){
                fs.mkdirSync(outputDir);
            }
            const fileName = songName + '.mid';
            const outputFilepath = path.join(outputDir , fileName);
            console.log(outputFilepath);
            fs.writeFileSync(outputFilepath, data.smf.dump(), 'binary');
            console.log('MIDI export completed!');
            resolve()
        })
    }
}
S2M.hasInstance = false;

module.exports = S2M;