const assert = require('chai').assert;
const S2M = require('..');
const environmentConfig = require('./config');

const s2m = S2M.build(environmentConfig);
// s2m.convertFromMatlab('bird');
s2m.convertFromSpear('large_bowl');
// s2m.convertFromSpear('long_text.txt')

// describe('Build s2m', function() {
//   it(
//       'should return type object', 
//       function(){          
//         assert.typeOf(s2m.config,'object');
//         assert.property(s2m.config, 'bpm');
//       }
//   );
// });

// describe('Convert from Spear', function() {
//     it(
//         'should return file type binary', 
//         function(){
//         s2m.convertFromSpear('large_bowl');
//         }
//     );
// });

// describe('Convert from Matlab', function() {
//   it(
//       'should return type object', 
//       function(){
//           s2m.build(environmentConfig);
//           s2m.convertFromMatlab('bird');
//       }
//   );
// });
