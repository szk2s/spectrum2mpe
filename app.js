const Patcher = require('./lib/Patcher');
const config = require('./config');

const testBoxes = ['CsvImport', 'Analyser', 'SmfGenerator', 'SmfPlayer', 'SmfExport'];  //Convert CSV into MPE
// const testBoxes = ['SineGenerator', 'CCtoSMF', 'SMFExport']; //under development

const patcher = new Patcher(config);

patcher.autoGen(testBoxes);
patcher.run();