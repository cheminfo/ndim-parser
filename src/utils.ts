import type { OneLowerCase } from 'cheminfo-types';

export function intToChar(int: number) {
  return String.fromCharCode(65 + int) as OneLowerCase;
}

export function nextChar(keys: string[]): OneLowerCase {
  for (let int = 0; int < 52; int++) {
    const char = intToChar(int);
    if (!keys.includes(char)) return char;
  }
  throw new Error('To many variables for key mapper');
}

export function defaultKeyMapper(keys: string[]): OneLowerCase[] {
  let currKeys: OneLowerCase[] = new Array(keys.length);
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

export function defaultLabelMap(keys: string[]): string[] {
  return keys.map((label) => label.replace(/_/g, ' '));
}

export function isNumericRow(line: string[]): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [first, ...list] = line;
  const filtered = list.filter((val) => !!val);
  if (filtered.length === 0) return false;
  return filtered.reduce((acc: boolean, curr) => acc && isNumber(curr), true);
}

export function isNumber(str: string): boolean {
  return !isNaN(parseFloat(str));
}

export function orderedKeyMap(
  keys: string[],
  ignoreFirst: boolean,
): OneLowerCase[] {
  let currKeys: OneLowerCase[] = new Array(keys.length);
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
