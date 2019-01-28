/* @flow */
const create2dArray = (rows: number): Array<Array<void>> => {
  var arr = [];
  for (var i = 0; i < rows; i++) {
    arr[i] = [];
  }
  return arr;
};

export default create2dArray;
