// Deprecated (under Development)
function csvImport(songName) {
  return new Promise((resolve, reject) => {
    console.log('Importing files...');
    // load csv files and parse matrix into array
    const inputTimecodeFilepath = path.join(
      this.config.directories.assets,
      '/csv',
      songName + '_timecode.csv'
    );
    const inputFreqsFilepath = path.join(
      this.config.directories.assets,
      '/csv',
      songName + '_freqs.csv'
    );
    const inputAmpsFilepath = path.join(
      this.config.directories.assets,
      '/csv',
      songName + '_amps.csv'
    );
    const inputEnvFilepath = path.join(
      this.config.directories.assets,
      '/csv',
      songName + '_env.csv'
    );

    const timecode2d = this.parseCSV(inputTimecodeFilepath);
    const freqs2d = this.parseCSV(inputFreqsFilepath);
    const amps2d = this.parseCSV(inputAmpsFilepath);
    const env2d = this.parseCSV(inputEnvFilepath);

    const partials = [];
    amps2d.forEach((amps, partialIdx) => {
      partials.push({
        id: partialIdx,
        numFrames: amps.length,
        startTime: timecode2d[0][0],
        endTime: timecode2d[0][timecode2d[0].length - 1],
        timecode: timecode2d[0],
        freqs: freqs2d[partialIdx],
        amps: amps2d[partialIdx],
        env: env2d[partialIdx]
      });
    });
    resolve(partials);

    // define subfunctions
    function parseCSV(filepath) {
      let transitions = fs
        .readFileSync(filepath)
        .toString()
        .split('\n');
      if (transitions[transitions.length - 1] == '') {
        transitions.pop();
      }
      for (let i in transitions) {
        transitions[i] = transitions[i].split(',').map(Number);
      }
      return transitions;
    }
  });
}

