import React from "react";
import {
  Group,
  Line,
} from "react-konva";

import Wire from "./Wire";
import { BLACK } from "../electrical/constants";

interface GroundSymbolProps {
  x: number;
  y: number;
}

const GroundSymbol: React.FC<
  GroundSymbolProps
> = ({ x, y }) => {
  return (
    <Group x={x} y={y}>
      {/* vertical connection */}
      <Wire points={[0, -18, 0, 0]} />

      {/* ground lines */}
      <Line
        points={[-12, 0, 12, 0]}
        stroke={BLACK}
        strokeWidth={1}
      />

      <Line
        points={[-8, 4, 8, 4]}
        stroke={BLACK}
        strokeWidth={1}
      />

      <Line
        points={[-4, 8, 4, 8]}
        stroke={BLACK}
        strokeWidth={1}
      />
    </Group>
  );
};

export default GroundSymbol;
