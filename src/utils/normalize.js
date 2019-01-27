const normalize = function(partials) {
  const allAmps = [];
  let i,
    length = partials.length;
  for (i = 0; i < length; i++) {
    allAmps.push(...partials[i].amps);
  }
  const ratio = 1 / max(allAmps);
  for (i = 0; i < length; i++) {
    partials[i].amps = partials[i].amps.map((amp) => amp * ratio);
  }
};

// define subfunction
function max(lst) {
  if (!Array.isArray(lst)) {
    throw new Error('argument of max must be array');
  }
  let result = lst[0],
    i,
    length = lst.length;
  for (i = 0; i < length; i++) {
    if (lst[i] > result) {
      result = lst[i];
    }
  }
  return result;
}

export default normalize;
