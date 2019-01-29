const path = require('path');
const s2m = require('../../lib');
const fs = require('fs');

module.exports = async () => {
  const json = fs.readFileSync(path.join(__dirname, './constants/mockData.json'), 'utf8');
  const mockData = JSON.parse(json);
  console.log(mockData);
  const { partials } = mockData;
  return partials;
};
