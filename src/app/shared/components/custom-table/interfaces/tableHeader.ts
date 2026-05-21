export interface tableHeader {
  key: keyof any | string;
  label: string;
  isLink?: boolean | null;
  isBool?: boolean | null;
  isCheckbox?: boolean | null;
  width?: number | null;
  isNormal?: boolean | null;
  isIcon?: boolean | null;

  badgeMap?: {
    [key: number | string]: { text: string; class: string };
  };
}
