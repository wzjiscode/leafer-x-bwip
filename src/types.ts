export type BwipOptions = {
  bcid?: string;
  text?: string;
  scale?: number;
  includetext?: boolean;
  backgroundcolor?: string;
  [k: string]: any;
};

export type TextOptions = {
  value?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  followStretch?: boolean;
  position?: 'top'|'bottom'|'left'|'right'|'center';
  offset?: number;
  align?: 'left'|'center'|'right';
  wrap?: boolean;
};

export type BwipNodeProps = {
  bwip?: BwipOptions;
  text?: TextOptions;
  background?: string;
};