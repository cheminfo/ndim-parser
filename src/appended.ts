import type { DataType, AppendedOptionsType, OutputType } from './types';
import { isNumber, isNumericRow, orderedKeyMap } from './utils';

export function appendedParser(
  text: string,
  options: AppendedOptionsType = {},
): OutputType[] {
  const {
    separator = ',',
    startTags = ['SetupTitle', 'Setup title'],
    minVariables = 4,
  } = options;

  const lines = text
    .split(/\r\n|\r|\n/)
    .filter((val) => !!val)
    .map((val) => val.trim().split(separator));

  let headers: number[] = [];
  let start: number[] = [];
  //for (let index = 0; index < 140; index++) {
  for (let index = 0; index < lines.length - 1; index++) {
    const currentLine = lines[index];
    const nextLine = lines[index + 1];

    // Identifies header of data
    if (
      nextLine.length === currentLine.length &&
      currentLine.length > minVariables &&
      !isNumericRow(currentLine) &&
      isNumericRow(nextLine)
    ) {
      headers.push(index);
    }

    // Identifies start of data
    if (startTags.includes(currentLine[0])) {
      start.push(index);
    }
  }

  // Validates that data was imported
  if (headers.length === 0 || start.length === 0) {
    throw new Error('Unable to retrieve structure');
  }
  if (headers.length !== start.length) {
    throw new Error('Unconsistent amount of headers an series');
  }

  // If has tags ignore first row
  const isTagged = !isNumber(lines[headers[0] + 1][0]);

  // Split in metadata, header and data
  let series = new Array(headers.length);
  for (let serieIndex = 0; serieIndex < headers.length; serieIndex++) {
    // Add metadata
    let meta: Record<string, string> = {};
    for (let index = start[serieIndex]; index < headers[serieIndex]; index++) {
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
    const labels = lines[headers[serieIndex]];
    const keys = orderedKeyMap(labels, isTagged);

    // Add data
    const endDataIndex =
      serieIndex + 1 === headers.length
        ? lines.length - 1
        : start[serieIndex + 1];
    let data: Record<string, DataType> = {};
    for (let keyIndex = isTagged ? 1 : 0; keyIndex < keys.length; keyIndex++) {
      data[keys[keyIndex]] = { data: [], label: labels[keyIndex] };
      for (let index = headers[serieIndex] + 1; index < endDataIndex; index++) {
        data[keys[keyIndex]].data.push(parseFloat(lines[index][keyIndex]));
      }
    }

    series[serieIndex] = { data, meta };
  }

  return series;
}
