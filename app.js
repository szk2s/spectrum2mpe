const Patcher = require('./lib/Patcher');
const config = require('./config');

const TestBoxes = ['CsvImport', 'Analyser', 'SmfGenerator', 'SmfPlayer', 'SmfExport'];

const patcher = new Patcher(config);

patcher.autoGen(TestBoxes);
patcher.run();