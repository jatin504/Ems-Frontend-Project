export interface Point {
  x: number;
  y: number;
  scale? : number;
}

export interface LineProps {
  points: number[];
  stroke?: string;
  strokeWidth?: number;
  dash?: number[];
}
