import React from "react";
import {
  Group,
  Rect,
  Text,
} from "react-konva";

import BlueText from "./BlueText";
import { BLUE } from "../electrical/constants";

interface MultifunctionMeterProps {
  x: number;
  y: number;
}

const MultifunctionMeter: React.FC<
  MultifunctionMeterProps
> = ({ x, y }) => (
  <Group x={x} y={y}>
    <Rect
      width={40}
      height={20}
      stroke="#222"
      fill="#fff"
    />

    <Text
      x={5}
      y={3}
      text="MFM"
      fontSize={12}
      fill={BLUE}
    />
  </Group>
);

export default MultifunctionMeter;
