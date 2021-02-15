export interface DataType {
  data: number[];
  label: string;
}

export interface AppendedOptionsType {
  separator?: string;
  startTags?: string[];
  minVariables?: number;
}

export interface OutputType {
  meta: Record<string, string>;
  data: Record<string, DataType>;
}

export interface GeneralOptionsType {
  separator?: string;
  isTagged?: boolean;
  keyMap?: (keys: string[]) => string[];
  labelMap?: (keys: string[]) => string[];
}
