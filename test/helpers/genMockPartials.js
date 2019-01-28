const path = require('path');
const s2m = require('../../lib');
module.exports = async () => {
  const partials = await s2m.txtImport(path.join(__dirname, '../assets/txt/large_bowl.txt'));
  return partials;
};
