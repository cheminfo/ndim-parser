import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { appendedParser } from '../index.ts';

test('multiple breakdown', () => {
  const csv = readFileSync(
    join(import.meta.dirname, 'data/multiple_breakdown.csv'),
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
  const csv = readFileSync(
    join(import.meta.dirname, 'data/breakdown.csv'),
    'latin1',
  );
  const parsed = appendedParser(csv);

  expect(parsed).toHaveLength(1);
  expect(parsed[0].variables).toHaveProperty('x');
  expect(parsed[0].variables).toHaveProperty('y');
});

test('capacitance', () => {
  const csv = readFileSync(
    join(import.meta.dirname, 'data/Cdg-V.csv'),
    'latin1',
  );
  const parsed = appendedParser(csv);

  expect(parsed).toHaveLength(1);
  expect(parsed[0].variables).toHaveProperty('x');
  expect(parsed[0].variables).toHaveProperty('y');
});

test('IV', () => {
  const csv = readFileSync(
    join(import.meta.dirname, 'data/sweep.csv'),
    'latin1',
  );
  const parsed = appendedParser(csv);

  expect(parsed).toHaveLength(1);
  expect(parsed[0].variables).toHaveProperty('x');
  expect(parsed[0].variables).toHaveProperty('y');
});
