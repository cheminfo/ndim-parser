import { readFileSync } from 'fs';
import { join } from 'path';

import { appendedParser } from '..';

test('multiple breakdown', () => {
  let csv = readFileSync(
    join(__dirname, '../../testFiles/multiple_breakdown.csv'),
    'latin1',
  );
  const parsed = appendedParser(csv);
  expect(parsed).toHaveLength(164);
  for (const serie of parsed) {
    expect(serie.data).toHaveProperty('x');
    expect(serie.data).toHaveProperty('y');
  }
});

test('breakdown', () => {
  let csv = readFileSync(
    join(__dirname, '../../testFiles/breakdown.csv'),
    'latin1',
  );
  const parsed = appendedParser(csv);
  expect(parsed).toHaveLength(1);
  expect(parsed[0].data).toHaveProperty('x');
  expect(parsed[0].data).toHaveProperty('y');
});

test('capacitance', () => {
  let csv = readFileSync(
    join(__dirname, '../../testFiles/Cdg-V.csv'),
    'latin1',
  );
  const parsed = appendedParser(csv);
  expect(parsed).toHaveLength(1);
  expect(parsed[0].data).toHaveProperty('x');
  expect(parsed[0].data).toHaveProperty('y');
});
