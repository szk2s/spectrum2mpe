/* @flow */
type NoteStatus = $ReadOnly<{
  ON: 1,
  OFF: -1,
  NO_EVENT: 0
}>;

const NOTE_STATUS: NoteStatus = {
  ON: 1,
  OFF: -1,
  NO_EVENT: 0
};

export default NOTE_STATUS;
