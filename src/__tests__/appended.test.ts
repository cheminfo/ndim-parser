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
    expect(serie.variables).toHaveProperty('x');
    expect(serie.variables).toHaveProperty('y');
  }
});

test('breakdown', () => {
  let csv = readFileSync(
    join(__dirname, '../../testFiles/breakdown.csv'),
    'latin1',
  );
  const parsed = appendedParser(csv);
  expect(parsed).toHaveLength(1);
  expect(parsed[0].variables).toHaveProperty('x');
  expect(parsed[0].variables).toHaveProperty('y');
});

test('capacitance', () => {
  let csv = readFileSync(
    join(__dirname, '../../testFiles/Cdg-V.csv'),
    'latin1',
  );
  const parsed = appendedParser(csv);
  expect(parsed).toHaveLength(1);
  expect(parsed[0].variables).toHaveProperty('x');
  expect(parsed[0].variables).toHaveProperty('y');
});

test('IV', () => {
  let csv = readFileSync(
    join(__dirname, '../../testFiles/sweep.csv'),
    'latin1',
  );
  const parsed = appendedParser(csv);
  expect(parsed).toHaveLength(1);
  expect(parsed[0].variables).toHaveProperty('x');
  expect(parsed[0].variables).toHaveProperty('y');
});
