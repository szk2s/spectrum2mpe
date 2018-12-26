const {expect, assert} = require('chai');
const s2m = require('..');
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

let partials;
let melodies;
let smfs;

describe('txtImport', function() {
    it(
        'should return an array of partials', 
        async function(){
            partials = await s2m.txtImport(__dirname + '/assets/txt/large_bowl.txt');
            assert.typeOf(partials, 'array');
            partials.forEach(partial => {
                assert.property(partial, 'freqs');
                assert.property(partial, 'amps');
                assert.property(partial, 'timecode');
                assert.property(partial, 'endTime');
            })
        }
    );
});

describe('partials2melodies', function() {
    it(
        'should return an array of melodies ', 
        async function(){
            melodies = await s2m.partials2melodies(partials);
            assert.typeOf(melodies, 'array');
            melodies.forEach(melody => {
                assert.property(melody, 'noteOnOffs');
                assert.property(melody, 'activeNoteNums');
                assert.property(melody, 'deltaCents');
                assert.property(melody, 'amps');
                assert.property(melody, 'timecode');
                assert.property(melody, 'endTime');
            })
        }
    );
});

describe('genSMFs', function() {
    it(
        'should return an array of smfs', 
        async function(){
            smfs = await s2m.genSMFs(melodies);
            assert.typeOf(smfs, 'array');
            smfs.forEach(smf => {
                expect(smf).to.be.an.instanceof(JZZ.MIDI.SMF);
                smf.forEach(midiTrack => {
                    expect(midiTrack).to.be.an.instanceof(JZZ.MIDI.SMF.MTrk);
                    midiTrack.forEach(midiMessage => {
                        expect(midiMessage).to.be.an.instanceof(JZZ.MIDI);
                    })
                })
            });
        }
    );
});

describe('smfExport', function() {
    it(
        'should export midi file', 
        async function(){
            const outputFilePath = __dirname + '/output/exported-by-smfExport-function.mid';
            s2m.smfExport(smfs[0], outputFilePath);
            const filetype = mime.lookup(outputFilePath);
            assert.equal(filetype, 'audio/midi');
        }
    )
});

describe('Convert', function() {
    it(
        'should export midi file', 
        async function(){
            await s2m.convertFromSpear(
                __dirname + '/assets/txt/large_bowl.txt', 
                { outputDirName: __dirname + '/output', makeOutputFolder: true, outputFolderName: 'exported-with-convertFromSpear-function'}
            );
            const filetype = mime.lookup(__dirname + '/output/exported-with-convertFromSpear-function/large_bowl.mid');
            assert.equal(filetype, 'audio/midi');
        }
    )
});

describe('smfsBatchExport', function() {
    it(
        'should export multiple midi files', 
        async function(){
            const manyPartials = await s2m.txtImport(__dirname + '/assets/txt/long_text.txt');
            const manyMelodies = await s2m.partials2melodies(manyPartials);
            const manySmfs = await s2m.genSMFs(manyMelodies, 'test-song');
            const dir = __dirname + '/output/exported-with-smfsBatchExport-function';
            if( fs.existsSync(dir) ){
                rimraf.sync(dir);
                fs.mkdirSync(dir);
            } else {
                fs.mkdirSync(dir);
            }
            await s2m.smfsBatchExport(
                manySmfs, 
                'long_text', 
                __dirname + '/output/exported-with-smfsBatchExport-function', 
                { makeOutputFolder: false }
            );

            const folderExists = fs.existsSync(dir);
            assert.equal(folderExists, true);

            const checkFiles = () => new Promise((resolve, reject) => {
                fs.readdirSync(dir).forEach(fileName => {
                    const filetype = mime.lookup(path.join(dir, fileName));
                    assert.equal(filetype, 'audio/midi');
                    resolve();
                })
            })
            
            (async () => {
                await checkFiles();
                console.log('done');
                done();
            })();
        }
    )
});