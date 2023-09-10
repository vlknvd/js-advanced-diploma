import { calcTileType } from '../js/utils';

test('top-left', () => {
  expect(calcTileType(0, 8)).toContain('top-left');
});
test('top', () => {
  expect(calcTileType(2, 8)).toContain('top');
});
test('top-right', () => {
  expect(calcTileType(7, 8)).toContain('top-right');
});
test('bottom-left', () => {
  expect(calcTileType(56, 8)).toContain('bottom-left');
});
test('left', () => {
  expect(calcTileType(32, 8)).toContain('left');
});
test('bottom', () => {
  expect(calcTileType(58, 8)).toContain('bottom');
});
test('bottom-right', () => {
  expect(calcTileType(63, 8)).toContain('bottom-right');
});
test('right', () => {
  expect(calcTileType(15, 8)).toContain('right');
});
test('center', () => {
  expect(calcTileType(17, 8)).toContain('center');
});
