const collectSMFs = (smfs) => {
  const initialValue = {
    ppqn: smfs[0].ppqn,
    type: smfs[0].type,
    tracks: []
  };
  const collectedSMFs = smfs.reduce((collection, smf) => {
    if (collection.ppqn !== smf.ppqn) {
      throw new Error('All SMFs must have exactly the same ppqn');
    }
    if (collection.type !== smf.type) {
      throw new Error('All SMFs must have exactly the same file type');
    }
    collection.tracks.push(...smf);
    return collection;
  }, initialValue);
  return collectedSMFs;
};
export default collectSMFs;