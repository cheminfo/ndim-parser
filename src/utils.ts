import type { OneLowerCase } from 'cheminfo-types';

/**
 * Converts an integer to a lowercase character (0 → 'a', 1 → 'b', etc.).
 * @param int - The integer to convert.
 * @returns The corresponding lowercase character.
 */
export function intToChar(int: number) {
  return String.fromCodePoint(97 + int) as OneLowerCase;
}

/**
 * Finds the next available lowercase character not already in the keys array.
 * @param keys - The array of already used keys.
 * @returns The next available lowercase character.
 */
export function nextChar(keys: string[]): OneLowerCase {
  for (let int = 0; int < 25; int++) {
    const char = intToChar(int);
    if (!keys.includes(char)) return char;
  }
  throw new Error('To many variables for key mapper');
}

/**
 * Default key mapper that assigns 'x' to the first column, 'y' to the second,
 * and uses the first character of remaining column names as keys.
 * @param keys - The array of column header strings.
 * @returns An array of single lowercase character keys.
 */
export function defaultKeyMapper(keys: string[]): OneLowerCase[] {
  const currKeys: OneLowerCase[] = new Array(keys.length);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (index === 0) {
      currKeys[index] = 'x';
    } else if (index === 1) {
      currKeys[index] = 'y';
    } else {
      const firstChar = key[0] as OneLowerCase;
      currKeys[index] = !currKeys.includes(firstChar)
        ? firstChar
        : nextChar(currKeys);
    }
  }
  return currKeys;
}

/**
 * Default label mapper that replaces underscores with spaces.
 * @param keys - The array of column header strings.
 * @returns An array of labels with underscores replaced by spaces.
 */
export function defaultLabelMap(keys: string[]): string[] {
  return keys.map((label) => label.replaceAll('_', ' '));
}

/**
 * Checks if a row of strings represents numeric data (ignoring the first field).
 * @param line - The array of string fields from a row.
 * @returns True if all non-empty fields after the first are numeric.
 */
export function isNumericRow(line: string[]): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [first, ...list] = line;
  const filtered = list.filter((val) => !!val);
  if (filtered.length === 0) return false;
  for (const value of filtered) {
    if (!isNumber(value)) return false;
  }
  return true;
}

/**
 * Checks if a string can be parsed as a number.
 * @param str - The string to check.
 * @returns True if the string represents a valid number.
 */
export function isNumber(str: string): boolean {
  return !Number.isNaN(Number.parseFloat(str));
}

/**
 * Creates an ordered key map assigning 'x' and 'y' to the first two data columns,
 * and sequential characters to the rest.
 * @param keys - The array of column header strings.
 * @param ignoreFirst - Whether to skip the first column (e.g., for tagged data).
 * @returns An array of single lowercase character keys.
 */
export function orderedKeyMap(
  keys: string[],
  ignoreFirst: boolean,
): OneLowerCase[] {
  const currKeys: OneLowerCase[] = new Array(keys.length);
  const start = ignoreFirst ? 1 : 0;
  for (let index = 0; index < keys.length; index++) {
    if (index === start) {
      currKeys[index] = 'x';
    } else if (index === start + 1) {
      currKeys[index] = 'y';
    } else {
      currKeys[index] = nextChar(currKeys);
    }
  }
  return currKeys;
}
