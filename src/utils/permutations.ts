export const getPermutations = (array: number[]): number[][] => {
  if (array.length === 0) return [[]];
  const result: number[][] = [];
  array.forEach((item, index) => {
    const rest = array.slice(0, index).concat(array.slice(index + 1));
    const permutations = getPermutations(rest);
    permutations.forEach((perm: number[]) => {
      result.push([item].concat(perm));
    });
  });
  return result;
};