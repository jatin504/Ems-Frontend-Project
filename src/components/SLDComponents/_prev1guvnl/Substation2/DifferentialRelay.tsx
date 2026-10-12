import React from "react";
import { Group, Rect, Arrow } from "react-konva";

import Label from "./Label";
import RelayCircle from "./RelayCircle";
import { RED } from "../electrical/constants";


export const DifferentialRelay: React.FC = () => (
  <Group>
    <Label
      x={418}
      y={285}
      text="TRAF. DIFF. RELAY"
      fontSize={9}
    />

    <Rect
      x={418}
      y={296}
      width={92}
      height={38}
      stroke={RED}
      strokeWidth={1}
    />

    <RelayCircle x={438} y={315} text="87T" radius={14} />
    <RelayCircle x={469} y={315} text="24" radius={14} />
    <RelayCircle x={499} y={315} text="49" radius={14} />

    {/* CT input */}
    <Arrow
      points={[575, 340, 511, 340]}
      stroke={RED}
      fill={RED}
      strokeWidth={2}
      pointerLength={8}
      pointerWidth={8}
    />

    <Label
      x={575}
      y={329}
      text="FROM 33KV LV CT"
      fontSize={9}
    />

    {/* 64R */}
    <RelayCircle x={438} y={365} text="64R" radius={14} />

    <Arrow
      points={[575, 365, 453, 365]}
      stroke={RED}
      fill={RED}
      strokeWidth={2}
      pointerLength={8}
      pointerWidth={8}
    />

    <Label
      x={575}
      y={354}
      text="FROM 66KV HV NCT CORE-1"
      fontSize={9}
    />
  </Group>
);
