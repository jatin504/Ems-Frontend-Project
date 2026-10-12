import React from "react";
import {
  Group,
  Rect,
  Line,
} from "react-konva";

import { Cyan } from "../electrical/constants";

interface EquipmentSymbolProps {
  x: number;
  y: number;
}

const EquipmentSymbol: React.FC<
  EquipmentSymbolProps
> = ({ x, y }) => (
  <Group x={x} y={y}>
    <Rect
      x={-14}
      y={-6}
      width={28}
      height={12}
      stroke={Cyan}
      strokeWidth={1}
    />

    <Line
      points={[-14, -6, 14, 6]}
      stroke={Cyan}
      strokeWidth={1}
    />

    <Line
      points={[14, -6, -14, 6]}
      stroke={Cyan}
      strokeWidth={1}
    />

    <Line
      points={[14, 0, 38, 0]}
      stroke={Cyan}
      strokeWidth={1}
    />

    <Line
      points={[38, -4, 44, 0, 38, 4]}
      stroke={Cyan}
      strokeWidth={1}
    />
  </Group>
);

export default EquipmentSymbol;
