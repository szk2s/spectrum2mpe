/* @flow */
const average = (nums: Array<number>): number => {
  const sum = nums.reduce((prev, current) => {
    return prev + current;
  });
  return sum / nums.length;
};

export default average;
