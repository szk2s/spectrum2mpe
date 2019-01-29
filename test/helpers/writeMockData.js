const path = require('path');
const s2m = require('../..');
const fs = require('fs');

const writeMockData = async () => {
  const partials = await s2m.textImport(path.join(__dirname, '../assets/txt/large_bowl.txt'));
  const mockData = { partials };
  fs.writeFileSync(path.join(__dirname, './constants/mockData.json'), JSON.stringify(mockData), 'utf8');
  console.log('Completed!');
};

writeMockData();
