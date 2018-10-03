const Patcher = require('./lib/Patcher');
// set up the convert options 
const config = require('./config');
const BOXES = ['CSV Import', 'Analyser', 'SMF Generator', 'SMF Player', 'SMF Export'];
const patcher = new Patcher(config);

patcher.initWith(BOXES);
patcher.run();