export interface PathData {
  id: string;
  d: string;
  fill?: string;
}

export interface SvgData {
  viewBox: string;
  width?: number;
  height?: number;
  paths: PathData[];
}

export interface ColorData {
  id: string;
  color: string;
  name: string;
}
