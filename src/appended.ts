import type {
  MeasurementXY,
  MeasurementXYVariables,
  OneLowerCase,
  MeasurementVariable,
} from 'cheminfo-types';

import type { AppendedOptionsType } from './types';
import { isNumber, isNumericRow, orderedKeyMap } from './utils';

export function appendedParser(
  text: string,
  options: AppendedOptionsType = {},
): MeasurementXY[] {
  const { separator = ',', minNumericRows = 5 } = options;

  const lines = text
    .split(/\r\n|\r|\n/)
    .filter((val) => !!val)
    .map((val) =>
      val
        .trim()
        .split(separator)
        .map((v) => v.trim()),
    );

  // Get numeric rows boundaries
  const startNumeric = [];
  const endNumeric = [];
  for (let index = 0; index < lines.length; index++) {
    const currentLine = lines[index];

    // Start numeric block
    if (
      index < lines.length - 1 &&
      !isNumericRow(currentLine) &&
      isNumericRow(lines[index + 1])
    ) {
      startNumeric.push(index);
    }

    // End numeric block
    if (
      index > 0 &&
      !isNumericRow(currentLine) &&
      isNumericRow(lines[index - 1])
    ) {
      endNumeric.push(index);
    }
  }
  if (startNumeric.length !== endNumeric.length + 1) {
    throw new Error('Mismatch between numeric blocks in file');
  }

  // Filter headers and start based on the minimum length
  const headers: number[] = [];
  const start: number[] = [0];
  for (let i = 0; i < startNumeric.length; i++) {
    // Last item in array
    if (i === startNumeric.length - 1) {
      headers.push(startNumeric[i]);
    }
    // The space in the block is good enough
    else if (endNumeric[i] - startNumeric[i] > minNumericRows) {
      headers.push(startNumeric[i]);
      start.push(endNumeric[i]);
    }
  }

  // Validates that data was imported
  if (headers.length === 0 || start.length === 0) {
    throw new Error('Unable to retrieve structure');
  }
  if (headers.length !== start.length) {
    throw new Error('Inconsistent amount of headers an series');
  }

  // If has tags ignore first row
  const isTagged = !isNumber(lines[headers[0] + 1][0]);

  // Split in metadata, header and data
  const series: MeasurementXY[] = new Array(headers.length);
  for (let seriesIndex = 0; seriesIndex < headers.length; seriesIndex++) {
    // Add metadata
    const meta: Record<string, string> = {};
    for (
      let index = start[seriesIndex];
      index < headers[seriesIndex];
      index++
    ) {
      if (lines[index].length === 2) {
        meta[lines[index][0]] = lines[index][1];
      }
      if (lines[index].length > 2) {
        const [first, second, ...value] = lines[index];
        if (isTagged) {
          meta[second] = value.join(separator);
        } else {
          meta[first] = [second, ...value].join(separator);
        }
      }
    }

    // Add variables structure to add units
    const labels = lines[headers[seriesIndex]];
    const keys = orderedKeyMap(labels, isTagged);

    // Add data
    const endDataIndex =
      seriesIndex + 1 === headers.length
        ? lines.length - 1
        : start[seriesIndex + 1];
    const variables: Partial<Record<OneLowerCase, MeasurementVariable>> = {};
    for (let keyIndex = isTagged ? 1 : 0; keyIndex < keys.length; keyIndex++) {
      const data: number[] = [];
      for (
        let index = headers[seriesIndex] + 1;
        index < endDataIndex;
        index++
      ) {
        data.push(parseFloat(lines[index][keyIndex]));
      }
      variables[keys[keyIndex]] = { data, label: labels[keyIndex] };
    }

    if (!variables.x || !variables.y) {
      throw new Error('x and y variables are necessary');
    }

    series[seriesIndex] = {
      variables: variables as MeasurementXYVariables,
      meta,
    };
  }

  return series;
}
