interface DataType {
  data: number[];
  label: string;
}

interface OptionsType {
  separator?: string;
}

export function ndParse(text: string, options?: OptionsType) {
  const { separator = ',' } = options || {};
  let meta: Record<string, string> = {};
  let data: Record<string, DataType> = {};

  let tempHeader: string[] | undefined;
  let header: string[] | undefined;
  for (const line of text.split(/\r\n|\r|\n/)) {
    const lineItems = line.split(separator);
    const isNumeric = line && !isNaN(Number(lineItems[0]));

    // Checks if the header is setted
    if (!header) {
      // Classifies if it's a header
      if (isNumeric) {
        // Fix the header
        header = tempHeader;
        for (let index = 0; index < lineItems.length; index++) {
          const key = tempHeader ? tempHeader[index] : String(index);
          const value = Number(lineItems[index]);
          if (!isNaN(value)) data[key] = { data: [value], label: key };
        }
      } else {
        // Add metavalues
        if (tempHeader) {
          const [key, ...values] = tempHeader.filter((t) => t);
          if (key) meta[key] = values.join(separator);
        }
        tempHeader = lineItems.map((t) => t.trim());
      }
    }

    // Deals with numerical values
    else if (isNumeric) {
      for (let index = 0; index < lineItems.length; index++) {
        const key = header ? header[index] : String(index);
        const value = Number(lineItems[index]);
        if (!isNaN(value)) data[key].data.push(value);
      }
    }
  }

  return { meta, data };
}
