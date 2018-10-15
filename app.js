const Patcher = require('./lib/Patcher');
const config = require('./config');
const BOXES = require('./lib/boxes');
const testBoxes = [BOXES.CsvImport, BOXES.Analyser, BOXES.SmfGenerator, BOXES.AddSlideCC, BOXES.SmfPlayer, BOXES.SmfExport];
// const testBoxes = ['CsvImport', 'OscSender']    //Send freqs and amps to Reaktor Synth
// const testBoxes = ['SineGenerator', 'CCtoSMF', 'SMFExport']; //under development

const patcher = new Patcher(config);

patcher.autoGen(testBoxes);
patcher.run();