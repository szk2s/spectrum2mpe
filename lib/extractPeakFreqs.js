const _ = require('lodash');

const extractPeakFreqs = (partials, targetPeaksNum = 15) => {
  console.log('extracting peak frequencies...');
  const frames = convertPartials2Frames(partials);
  frames.forEach((frame, idx, frames) => {
    console.log(
      'marking frame ' + (idx + 1) + ' (total ' + frames.length + ' frames)'
    );
    markPeaks(frame, targetPeaksNum);
  });
  const compressedFrames = compressFrames(frames);
  const compressedPartials = convertFrames2Partials(compressedFrames);
  return Promise.resolve(compressedPartials);
};

// define subfunctions
function convertPartials2Frames(partials) {
  const framesTimes = partials.reduce((framesTimes, partial) => {
    framesTimes.push(...partial.timecode);
    return _.uniq(framesTimes);
  }, []);
  const frames = partials.reduce(
    (frames, partial) => {
      partial.timecode.forEach((time, timeIdx) => {
        const target = frames.map((frame) => frame.time).indexOf(time);
        if (target === -1) {
          throw new Error('No frame to add partial data');
        }
        frames[target].points.push({
          freq: partial.freqs[timeIdx],
          amp: partial.amps[timeIdx],
          isPeak: false
        });
      });
      return frames;
    },
    framesTimes.map((frameTime) => {
      return { time: frameTime, points: [] };
    })
  );
  frames.forEach((frame) => {
    frame.points.sort((a, b) => a.freq - b.freq);
    frame.points.forEach((point, idx) => {
      point.id = idx;
    });
  });
  return frames;
}

function convertFrames2Partials(frames) {
  const partials = frames[0].points.map((_, idx) => {
    return {
      id: idx,
      numFrames: frames.length,
      startTime: frames[0].time,
      endTime: frames[frames.length - 1].time,
      timecode: [],
      freqs: [],
      amps: []
    };
  });
  frames.forEach((frame) => {
    partials.forEach((partial) => {
      partial.timecode.push(frame.time);
    });
    frame.points.forEach((point, idx) => {
      partials[idx].freqs.push(point.freq);
      partials[idx].amps.push(point.amp);
    });
    partials.forEach((partial) => {
      // 0 padding
      const diff = partial.timecode.length - partial.amps.length;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          partial.freqs.push(0);
          partial.amps.push(0);
        }
      }
    });
  });
  return partials;
}

function markPeaks(frame, targetPeaksNum = 15) {
  const points = frame.points;
  points.forEach((point) => {
    if (point.amp < 0) {
      throw new Error('bad amplitude value' + point.amp);
    }
  });
  const { main: peakIDs, sub: subPeakIDs } = collectPeakIDs(
    points,
    targetPeaksNum
  );
  // For example, if peakIDs.length == 7, targetPeaksNum == 10,
  // you need additional 3 peak frequency.
  // Let's collect additional peak IDs from subPeakIDs.
  let missingNumPeaks = targetPeaksNum - peakIDs.length;
  for (let i = 0; i < points.length; i++) {
    if (missingNumPeaks === 0) {
      break;
    }
    const subPeakPoints = subPeakIDs.map((id) =>
      points.find((point) => point.id === id)
    );
    const { main: pushedIDs } = collectPeakIDs(subPeakPoints, missingNumPeaks);
    peakIDs.push(...pushedIDs);
    _.remove(subPeakIDs, (id) => pushedIDs.includes(id));
    missingNumPeaks = targetPeaksNum - peakIDs.length;
  }

  peakIDs.forEach((id) => {
    const point = points.find((point) => point.id === id);
    point.isPeak = true;
  });
}

function collectPeakIDs(_points, targetNum = 1) {
  if (targetNum < 1) {
    throw new Error('invalid targetNum');
  }
  const peakIDs = { main: [], sub: [] };
  for (let i = 0; i < _points.length; i++) {
    _points.forEach((_point, idx, _points) => {
      const [first, last] = [0, _points.length - 1];
      const IMAGINARY_AMP = -1;
      const prevAmp = idx === first ? IMAGINARY_AMP : _points[idx - 1].amp;
      const nextAmp = idx === last ? IMAGINARY_AMP : _points[idx + 1].amp;
      const isLocalMaximum = prevAmp < _point.amp && _point.amp > nextAmp;
      if (isLocalMaximum) {
        peakIDs.main.push(_point.id);
      }
    });
    if (peakIDs.main.length <= targetNum) {
      _.remove(peakIDs.sub, (id) => peakIDs.main.includes(id));
      break;
    }
    _points = peakIDs.main.map((id) =>
      _points.find((point) => id === point.id)
    );
    peakIDs.sub = [...peakIDs.main];
    peakIDs.main = [];
  }
  return peakIDs;
}

function compressFrames(frames) {
  const compressedFrames = _.cloneDeep(frames).map((frame) => {
    frame.points = frame.points.filter((point) => point.isPeak);
    return frame;
  });
  return compressedFrames;
}

module.exports = extractPeakFreqs;
