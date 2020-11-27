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

export function ndParse(text: string, options?: OptionsType): OutputType {
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
        header = tempHeader;
        for (let index = 0; index < fields.length; index++) {
          const key = tempHeader ? tempHeader[index] : String(index);
          const value = Number(fields[index]);
          if (!isNaN(value)) data[key] = { data: [value], label: key };
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
        const key = header ? header[index] : String(index);
        const value = Number(fields[index]);
        if (!isNaN(value)) data[key].data.push(value);
      }
    }
  }

  return { meta, data };
}
