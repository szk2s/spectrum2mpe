const average = (nums) => {
  const sum = nums.reduce((prev, current) => {
    return prev + current;
  });
  return sum / nums.length;
};

export default average;
