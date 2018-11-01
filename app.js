const Patcher = require('./lib/Patcher');
const config = require('./config');
const BOXES = require('./lib/boxes');
// const testBoxes = [BOXES.CsvImport, BOXES.Analyser, BOXES.SmfGenerator, BOXES.MasterChannelCC, BOXES.SmfPlayer, BOXES.SmfExport];
const testBoxes = [BOXES.CsvImport, BOXES.OscSender]    //Send freqs and amps to Reaktor Synth
// const testBoxes = [BOXES.SineGenerator, BOXES.CCtoSMF, BOXES.SMFExport]; //under development

const patcher = new Patcher(config);

patcher.autoGen(testBoxes);
patcher.run();