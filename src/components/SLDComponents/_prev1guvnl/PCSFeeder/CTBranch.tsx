import React from "react";
import {
  Group,
  Circle,
} from "react-konva";

import Wire from "./Wire";
import GroundSymbol from "./GroundSymbol";
import { BLACK } from "../electrical/constants";

interface CTBranchProps {
  x: number;
  y: number;
}

const CTBranch: React.FC<
  CTBranchProps
> = ({ x, y }) => {
  return (
    <Group x={x} y={y}>

      {/* vertical wire */}
      <Wire
        points={[0, 0, 0, 30]}
      />

      {/* CT circle */}
      <Circle
        x={0}
        y={35}
        radius={6}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      {/* horizontal outgoing wire */}
      <Wire
        points={[0, 35, 60, 35]}
      />

      {/* ground */}
      <GroundSymbol
        x={28}
        y={0}
      />
    </Group>
  );
};

export default CTBranch;
