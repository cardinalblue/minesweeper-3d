export const rangeMatrix = <T, M>(
  matrix: T[][],
  cb: (item: T, i: number, j: number) => M,
): M[][] => {
  return matrix.map((cols, i) => cols.map((unit, j) => cb(unit, i, j)));
};
