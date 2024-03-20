import { readFileSync } from 'fs';
import { join } from 'path';

import { test, expect } from 'vitest';

import { ndParse } from '../ndParse';

test('shimadzu test1', () => {
  const blob = readFileSync(join(__dirname, 'data/test1.txt'));
  const result = ndParse(blob, { separator: '\t' });
  expect(Object.keys(result.variables)).toHaveLength(20);
  expect(result).toMatchSnapshot();
});

/*
test.only('shimadzu test2', () => {
  const blob = readFileSync(join(__dirname, 'data/test2.txt'), 'utf8');
  const result = ndParse(blob, { separator: '\t' });
  expect(Object.keys(result.variables)).toHaveLength(20);
  expect(result).toMatchSnapshot();
});
*/

test('shimadzu test3', () => {
  const blob = readFileSync(join(__dirname, 'data/test3.txt'));
  const result = ndParse(blob, { separator: '\t' });
  expect(Object.keys(result.variables)).toHaveLength(2);
  expect(result).toMatchSnapshot();
});
