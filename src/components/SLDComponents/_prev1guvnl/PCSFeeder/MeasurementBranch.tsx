import React from "react";
import {
  Group,
  Circle,
  Rect,
  Text,
} from "react-konva";

import Wire from "./Wire";
import GroundSymbol from "./GroundSymbol";
import { BLACK, BLUE } from "../electrical/constants";

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

      {/* vertical */}
      {/* <Wire
        points={[0, 0, 0, 40]}
      /> */}

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

      {/* ground */}
      {/* <GroundSymbol
        x={28}
        y={5}
      /> */}

      {/* TCP/IP */}
      {/* <Text
        x={85}
        y={5}
        text="TCP/IP"
        fontSize={13}
        fill={BLUE}
      /> */}

      {/* MFM */}
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
        text="MFM"
        fontSize={11}
        align="center"
        fill={BLUE}
      />

      {/* BUS PT */}
      {/* <Rect
        x={105}
        y={47}
        width={58}
        height={15}
        stroke={BLUE}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={105}
        y={48}
        width={58}
        text="BUS PT"
        fontSize={11}
        align="center"
        fill={BLUE}
      /> */}
    </Group>
  );
};

export default MeasurementBranch;
