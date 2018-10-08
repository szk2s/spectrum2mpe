
// const glob = require( 'glob' )
// const path = require( 'path' );
// const classes = []

// const filepaths = glob.sync( './lib/boxes/*.js' ).filter(filepath => !filepath.match(/.*index.js/));

// filepaths.forEach( filepath => {
//   classes.push(require(path.resolve(filepath)));
// });

// module.exports = {classes};

/////////////////////////////////////

const Analyser = require('./Analyser');
const CsvImport = require('./CsvImport');
const SmfExport = require('./SmfExport');
const SmfGenerator = require('./SmfGenerator');
const SmfPlayer = require('./SmfPlayer');
const SineGenerator = require('./SineGenerator')
module.exports = {
  Analyser,
  CsvImport,
  SmfExport,
  SmfGenerator,
  SmfPlayer,
  SineGenerator
}