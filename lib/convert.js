
//Deprecated (under Development)
async function convertFromMatlab(songName) {
  const partials = await this.csvImport(songName);
  const melodies = await this.partials2melodies(partials);
  const smfs = await this.genSMFs(melodies, songName);
  this.smfsBatchExport(smfs, songName);
}

module.exports = { convertFromSpear };
