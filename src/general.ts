import type { MeasurementXY, OneLowerCase } from 'cheminfo-types';

import type { GeneralOptionsType } from './types';
import { defaultKeyMapper, defaultLabelMap, intToChar } from './utils';

export function ndParse(
  text: string,
  options?: GeneralOptionsType,
): MeasurementXY<number[]> {
  const {
    separator = ',',
    isTagged = false,
    keyMap = defaultKeyMapper,
    labelMap = defaultLabelMap,
  } = options || {};
  const meta: MeasurementXY['meta'] = {};
  const variables: Partial<MeasurementXY<number[]>['variables']> = {};

  let tempHeader: string[] = [];
  let header: OneLowerCase[] | undefined;
  let labels: string[] = [];
  let prevTag: string | undefined;
  let tag: string | undefined;

  for (const line of text.split(/\r\n|\r|\n/)) {
    const fields = line.split(separator);
    if (isTagged) {
      prevTag = tag;
      tag = fields.shift();
    }

    const isNumeric =
      line && (isTagged ? tag === 'DataValue' : !isNaN(Number(fields[0])));

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
          if (
            prevTag &&
            [
              'SetupTitle',
              'PrimitiveTest',
              'Dimension1',
              'Dimension2',
            ].includes(prevTag)
          ) {
            meta[prevTag] = [key, ...values].join(separator);
          } else if (key) {
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
