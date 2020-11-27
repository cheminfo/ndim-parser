interface DataType {
  data: number[];
  label: string;
}

interface OptionsType {
  separator?: string;
}

interface OutputType {
  meta: Record<string, string>;
  data: Record<string, DataType>;
}

function intToChar(int: number): string {
  return String.fromCharCode(65 + int);
}

function nextChar(keys: string[]): string {
  for (let int = 0; int < 52; int++) {
    const char = intToChar(int);
    if (!keys.includes(char)) return char;
  }
  throw new Error('To many variables for key mapper');
}

function defaultKeyMapper(keys: string[]): string[] {
  let currKeys: string[] = new Array(keys.length);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (index === 0) {
      currKeys[index] = 'x';
    } else if (index === 1) {
      currKeys[index] = 'y';
    } else {
      currKeys[index] = !currKeys.includes(key[0])
        ? key[0]
        : nextChar(currKeys);
    }
  }
  return currKeys;
}

export function ndParse(
  text: string,
  keyMap?: (keys: string[]) => string[],
  options?: OptionsType,
): OutputType {
  const keyMapper = keyMap || defaultKeyMapper;
  const { separator = ',' } = options || {};
  let meta: OutputType['meta'] = {};
  let data: OutputType['data'] = {};

  let tempHeader: string[] | undefined;
  let header: string[] | undefined;
  for (const line of text.split(/\r\n|\r|\n/)) {
    const fields = line.split(separator);
    const isNumeric = line && !isNaN(Number(fields[0]));

    // Checks if the header is setted
    if (!header) {
      // Classifies if it's a header
      if (isNumeric) {
        // Fix the header
        header = keyMapper(tempHeader || []);
        for (let index = 0; index < fields.length; index++) {
          const label = tempHeader ? tempHeader[index] : intToChar(index);
          const value = Number(fields[index]);
          const key = header[index];
          if (!isNaN(value)) data[key] = { data: [value], label };
        }
      } else {
        // Add metavalues
        if (tempHeader) {
          const [key, ...values] = tempHeader.filter((t) => t);
          if (key) meta[key] = values.join(separator);
        }
        tempHeader = fields.map((t) => t.trim());
      }
    }

    // Deals with numerical values
    else if (isNumeric) {
      for (let index = 0; index < fields.length; index++) {
        const key = header ? header[index] : intToChar(index);
        const value = Number(fields[index]);
        if (!isNaN(value)) data[key].data.push(value);
      }
    }
  }

  return { meta, data };
}
