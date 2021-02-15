interface DataType {
  data: number[];
  label: string;
}

export interface OptionsType {
  separator?: string;
  keyMap?: (keys: string[]) => string[];
  labelMap?: (keys: string[]) => string[];
}

export interface OutputType {
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

export function appendedParser(
  text: string,
  options: OptionsType = {},
): OutputType[] {
  const { separator = ',' } = options;

  const lines = text
    .split(separator)
    .filter((val) => !!val)
    .map((val) => val.trim());

  // Identifies header of data
  // If has headers ignore first row
  // Split in metadata, header and data
  // Search for units, scale and  main variables in metadata
  return [];
}
