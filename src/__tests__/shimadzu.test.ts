import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { ndParse } from '../ndParse.ts';

test('shimadzu test1', () => {
  const blob = readFileSync(join(import.meta.dirname, 'data/test1.txt'));
  const result = ndParse(blob, { separator: '\t' });

  expect(Object.keys(result.variables)).toHaveLength(20);
  expect(result).toMatchSnapshot();
});

test('shimadzu test2', () => {
  const blob = readFileSync(
    join(import.meta.dirname, 'data/test2.txt'),
    'utf8',
  );

  // test2.txt has a "Name" column (H2, O2, N2) mapped to 'y' by defaultKeyMapper.
  // Since these values are non-numeric, the 'y' variable is never created and ndParse throws.
  expect(() => ndParse(blob, { separator: '\t' })).toThrowError(
    'x and y variables are necessary',
  );
});

test('shimadzu test3', () => {
  const blob = readFileSync(join(import.meta.dirname, 'data/test3.txt'));
  const result = ndParse(blob, { separator: '\t' });

  expect(Object.keys(result.variables)).toHaveLength(2);
  expect(result).toMatchSnapshot();
});
