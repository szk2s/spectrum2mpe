const second2tick = (second, bpm, ppqn) => {
  const tick = (second / 60.0) * bpm * ppqn;
  return Math.round(tick);
};

export default second2tick;
