import type { MeasurementXY, OneLowerCase, TextData } from 'cheminfo-types';
import { ensureString } from 'ensure-string';

import type { GeneralOptionsType } from './types';
import { defaultKeyMapper, defaultLabelMap, intToChar } from './utils';

export function ndParse(
  blob: TextData,
  options?: GeneralOptionsType,
): MeasurementXY<number[]> {
  const {
    separator = ',',
    keyMap = defaultKeyMapper,
    labelMap = defaultLabelMap,
  } = options || {};
  const text = ensureString(blob);
  const meta: MeasurementXY['meta'] = {};
  const variables: Partial<MeasurementXY<number[]>['variables']> = {};

  let tempHeader: string[] = [];
  let header: OneLowerCase[] | undefined;
  let labels: string[] = [];

const lines = text.split(/\r\n|\r|\n/);

  for (const line of lines){
    const fields = line.split(separator);

    const isNumeric =
      line &&  !isNaN(Number(fields[0]));
    // Checks if the header is set
    if (!header) {
      // Classifies if it's a header
      if (isNumeric) {
        // Fix the header
        header = keyMap(tempHeader);
        labels = labelMap(tempHeader);
        for (let index = 0; index < fields.length; index++) {
          const label = labels[index] || intToChar(index);
          const value = Number(fields[index]);
          const key = header[index];
          if (!isNaN(value)) variables[key] = { data: [value], label };
        }
      } else {
        // Add meta-values
        if (tempHeader) {
          const [key, ...values] = tempHeader.filter((t) => t);
          if (key) {
            meta[key] = values.join(separator);
          }
        }
        tempHeader = fields.map((t) => t.trim());
      }
    }

    // Deals with numerical values
    else if (isNumeric) {
      for (let index = 0; index < fields.length; index++) {
        const key = header ? header[index] : intToChar(index);
        const value = Number(fields[index]);
        if (!isNaN(value)) variables[key]?.data.push(value);
      }
    }
  }

  const { x, y, ...unorderedData } = variables;
  if (!x || !y) throw new Error('x and y variables are necessary');

  return { meta, variables: { x, y, ...unorderedData } };
}
