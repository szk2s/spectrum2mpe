const Patcher = require('./lib/Patcher');
// set up the convert options 
const config = require('./config');

const patcher = new Patcher(config);

patcher.addBox('CSV Import');
patcher.addBox('Analyser');
patcher.addBox('SMF Generator');
patcher.addBox('SMF Player');
patcher.addBox('SMF Export');

patcher.run();