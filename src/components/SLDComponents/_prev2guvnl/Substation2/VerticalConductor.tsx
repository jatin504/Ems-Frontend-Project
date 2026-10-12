import React from "react";
import RedLine from "./RedLine";

interface Props {
  x: number;
  y1: number;
  y2: number;
}

const VerticalConductor: React.FC<Props> = ({
  x,
  y1,
  y2,
}) => (
  <RedLine
    points={[x, y1, x, y2]}
    strokeWidth={3}
  />
);

export default VerticalConductor;
