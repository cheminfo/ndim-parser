import type { OneLowerCase } from 'cheminfo-types';

export interface AppendedOptionsType {
  separator?: string;
  minNumericRows?: number;
}

export interface GeneralOptionsType {
  separator?: string;
  isTagged?: boolean;
  keyMap?: (keys: string[]) => OneLowerCase[];
  labelMap?: (keys: string[]) => string[];
}
