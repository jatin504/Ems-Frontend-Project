import React from "react";
import {
  Group,
  Circle,
} from "react-konva";

import Wire from "./Wire";
import GroundSymbol from "./GroundSymbol";
import ProtectionCircle from "./ProtectionCircle";
import { BLACK } from "../electrical/constants";

interface Differential87TProps {
  x: number;
  y: number;
}

const Differential87T: React.FC<
  Differential87TProps
> = ({ x, y }) => {
  return (
    <Group x={x} y={y}>

      {/* incoming vertical */}
      <Wire
        points={[0, 0, 0, 35]}
      />

      {/* CT */}
      <Circle
        x={0}
        y={40}
        radius={6}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      {/* outgoing wire */}
      <Wire
        points={[
          0,
          40,
          120,
          40,
          120,
          480,
        ]}
      />

      {/* ground */}
      <GroundSymbol
        x={28}
        y={5}
      />

      {/* 87T */}
      <ProtectionCircle
        x={115}
        y={40}
        text="87T"
        radius={18}
      />
    </Group>
  );
};

export default Differential87T;
