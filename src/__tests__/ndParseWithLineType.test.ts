import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { ndParseWithLineType } from '../ndParseWithLineType.ts';

test('breakdown', () => {
  const csv = readFileSync(
    join(import.meta.dirname, 'data/breakdown.csv'),
    'latin1',
  );
  const parsed = ndParseWithLineType(csv, { isTagged: true });
  const keys = ['x', 'y', 'I', 'a', 'b', 'c'];

  expect(Object.keys(parsed.variables)).toStrictEqual(keys);
});
