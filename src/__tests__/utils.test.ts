import { isNumericRow } from '../utils';

test('isNumericRow', () => {
  expect(isNumericRow(['test', '1', '2', '4'])).toBe(true);
  expect(isNumericRow(['1', '2', '4'])).toBe(true);
  expect(isNumericRow(['test', '1'])).toBe(true);
  expect(isNumericRow(['test', 'test'])).toBe(false);
  expect(isNumericRow(['3', 'test', '1'])).toBe(false);
});
