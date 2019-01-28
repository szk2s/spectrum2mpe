/* @flow */
const reducePartials = (partials: Array<Partial>): Promise<void> =>
  new Promise((resolve) => {
    console.log('Reducing number of partials');
    partials.sort((a, b) => a.startTime - b.startTime);
    for (let i = 0; i < partials.length - 1; i = i + 1) {
      for (let j = i + 1; j < partials.length; ) {
        if (partials[i].endTime < partials[j].startTime) {
          partials[i].endTime = partials[j].endTime;
          partials[i].timecode.push(...partials[j].timecode);
          partials[i].amps.push(...partials[j].amps);
          partials[i].freqs.push(...partials[j].freqs);
          partials.splice(j, 1);
        } else {
          j = j + 1;
        }
      }
    }
    resolve();
  });

export default reducePartials;
