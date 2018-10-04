const Patcher = require('./lib/Patcher');

const config = require('./config');
const { CSV_IMPORT, ANALYSER, SMF_GENERATOR, SMF_PLAYER, SMF_EXPORT } = require('./constants/BOX_TYPES');
const BOXES = [CSV_IMPORT, ANALYSER, SMF_GENERATOR, SMF_PLAYER, SMF_EXPORT];

const patcher = new Patcher(config);

patcher.initWith(BOXES);
patcher.run();