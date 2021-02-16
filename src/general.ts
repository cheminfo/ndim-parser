import type { GeneralOptionsType, OutputType } from './types';
import { defaultKeyMapper, defaultLabelMap, intToChar } from './utils';

export function ndParse(
  text: string,
  options?: GeneralOptionsType,
): OutputType {
  const {
    separator = ',',
    isTagged = false,
    keyMap = defaultKeyMapper,
    labelMap = defaultLabelMap,
  } = options || {};
  let meta: OutputType['meta'] = {};
  let data: OutputType['data'] = {};

  let tempHeader: string[] = [];
  let header: string[] | undefined;
  let labels: string[] = [];
  let prevTag: string | undefined;
  let tag: string | undefined;

  for (const line of text.split(/\r\n|\r|\n/)) {
    let fields = line.split(separator);
    if (isTagged) {
      prevTag = tag;
      tag = fields.shift();
    }

    const isNumeric =
      line && (isTagged ? tag === 'DataValue' : !isNaN(Number(fields[0])));

    // Checks if the header is setted
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
          if (!isNaN(value)) data[key] = { data: [value], label };
        }
      } else {
        // Add metavalues
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
        if (!isNaN(value)) data[key]?.data.push(value);
      }
    }
  }

  const { x, y, ...unorderData } = data;
  return { meta, data: { x, y, ...unorderData } };
}
