import React from "react";
import {
  Group,
  Circle,
  Rect,
  Text,
} from "react-konva";

import { BLACK, BLUE } from "../electrical/constants";
import Wire from "../PCSFeeder/Wire";

interface MeasurementBranchProps {
  x: number;
  y: number;
  scale? : number;
}

const MeasurementBranch: React.FC<
  MeasurementBranchProps
> = ({ x, y, scale=1 }) => {
  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>

      {/* CT */}
      <Circle
        x={0}
        y={57}
        radius={6}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      {/* horizontal */}
      <Wire
        points={[0, 50, 100, 50]}
      />

      
      {/* TFM */}
      <Rect
        x={68}
        y={40}
        width={36}
        height={15}
        stroke={BLUE}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={68}
        y={42}
        width={36}
        text="TVM"
        fontSize={11}
        align="center"
        fill={BLUE}
      />

    </Group>
  );
};

export default MeasurementBranch;
