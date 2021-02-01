import { readFileSync } from 'fs';
import { join } from 'path';

import { ndParse } from '..';

const simpleExample = `
meta.first,1
meta.second,,2
temp, volt, curr, temp_sup
1,1,1,1
2,2,2,2
3,3,3,3
`;

test('simpleExample', () => {
  expect(ndParse(simpleExample)).toStrictEqual({
    data: {
      x: { data: [1, 2, 3], label: 'temp' },
      y: { data: [1, 2, 3], label: 'volt' },
      c: { data: [1, 2, 3], label: 'curr' },
      t: { data: [1, 2, 3], label: 'temp sup' },
    },
    meta: {
      'meta.first': '1',
      'meta.second': '2',
    },
  });
});

test('with options', () => {
  expect(
    ndParse(simpleExample, {
      keyMap: () => ['y', 'x', 'c', 'v'],
      labelMap: () => [
        'temperature',
        'ground volts',
        'ground current',
        'superficial temperature',
      ],
    }),
  ).toStrictEqual({
    data: {
      x: { data: [1, 2, 3], label: 'ground volts' },
      y: { data: [1, 2, 3], label: 'temperature' },
      c: { data: [1, 2, 3], label: 'ground current' },
      v: { data: [1, 2, 3], label: 'superficial temperature' },
    },
    meta: {
      'meta.first': '1',
      'meta.second': '2',
    },
  });
});

test('real file', () => {
  let csv = readFileSync(
    join(__dirname, '../../testFiles/Cdg-V.csv'),
    'latin1',
  );
  const parsed = ndParse(csv);
  const keys = ['x', 'y', 'G', 'Q', 'C', 'A', 'I', 'F', 'B'];
  expect(parsed.meta['Channel.Mode']).toBe('V');
  expect(Object.keys(parsed.data)).toStrictEqual(keys);
});

test('breakdown', () => {
  let csv = readFileSync(
    join(__dirname, '../../testFiles/breakdown.csv'),
    'latin1',
  );
  const parsed = ndParse(csv, { isTagged: true });
  const keys = ['x', 'y', 'I', 'A', 'B', 'C'];
  expect(Object.keys(parsed.data)).toStrictEqual(keys);
});
