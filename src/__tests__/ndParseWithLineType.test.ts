import {readFileSync} from 'fs';
import {join} from 'path';
import {test, expect} from 'vitest';
import { ndParseWithLineType } from '../ndParseWithLineType';

test('breakdown', () => {
  const csv = readFileSync(
    join(__dirname, '../../testFiles/breakdown.csv'),
    'latin1',
  );
  const parsed = ndParseWithLineType(csv, { isTagged: true });
  const keys = ['x', 'y', 'I', 'a', 'b', 'c'];
  expect(Object.keys(parsed.variables)).toStrictEqual(keys);
});
