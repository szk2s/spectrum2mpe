// Deprecated (under Development)
function addMasterChannelCC(data) {
  return new Promise((resolve, reject) => {
    console.log('Now processing 1ch as a master channel...');
    const trk = data.smf[0];
    addSlideCC(this.config.slideCC);
    data.smf[0] = trk;
    resolve(data);

    function addSlideCC(ccNum) {
      data.env[0].forEach((val, idx) => {
        let msg = JZZ.MIDI.control(0, ccNum, Math.round(val * 127));
        trk.add(data.timecode[idx], msg);
      });
    }
  });
}
