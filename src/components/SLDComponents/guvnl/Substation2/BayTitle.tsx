import React from "react";
import { Group, Rect } from "react-konva";
import Label from "./Label";
import { Blue, RED } from "../electrical/constants";

const BayTitle: React.FC = () => (
  <Group>
    <Rect
      x={445}
      y={35}
      width={220}
      height={31}
      stroke={RED}
      strokeWidth={2}
    />

    <Label
      x={455}
      y={40}
      text="66 kV TRAFO-1 BAY"
      fontSize={20}
      fill={Blue}
    />
  </Group>
);

export default BayTitle;
