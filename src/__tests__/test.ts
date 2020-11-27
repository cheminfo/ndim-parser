import { readFileSync } from 'fs';
import { join } from 'path';

import { ndParse } from '..';

const simpleExample = `
meta.first,1
meta.second,,2
temp, volt, curr
1,1,1
2,2,2
3,3,3
`;

test('simpleExample', () => {
  expect(ndParse(simpleExample)).toStrictEqual({
    data: {
      t: { data: [1, 2, 3], label: 'temp' },
      v: { data: [1, 2, 3], label: 'volt' },
      c: { data: [1, 2, 3], label: 'curr' },
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
  const keys = ['4', '5', '8', 'V', 'C', 'G', 'Q', 'I', 'F'];
  expect(parsed.meta['Channel.Mode']).toBe('V');
  expect(Object.keys(parsed.data)).toStrictEqual(keys);
});
