const fillBlankTime = (partials) =>
  new Promise((resolve) => {
    console.log('filling blank time with another partial...');
    partials.sort((a, b) => a.startTime - b.startTime);
    for (let i = 0; i < partials.length - 1; i = i + 1) {
      for (let j = i + 1; j < partials.length; ) {
        if (partials[i].endTime < partials[j].startTime) {
          partials[i].endTime = partials[j].endTime;
          partials[i].timecode.push(...partials[j].timecode);
          partials[i].amps.push(...partials[j].amps);
          partials[i].freqs.push(...partials[j].freqs);
          partials[i].numFrames = partials[i].numFrames + partials[j].numFrames;
          partials.splice(j, 1);
        } else {
          j = j + 1;
        }
      }
    }
    resolve();
  });

module.exports = fillBlankTime;
