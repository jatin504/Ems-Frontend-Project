import React from "react";
import { Group, Rect, Arrow } from "react-konva";

import Label from "./Label";
import RedLine from "./RedLine";
import RelayCircle from "./RelayCircle";
import { RED } from "../electrical/constants";


export const RelaySection: React.FC = () => {
  const relays = [
    "50",
    "51",
    "50N",
    "51N",
    "27",
    "59",
    "67",
    "67N",
    "50",
    "51",
  ];

  return (
    <Group>
      <Label
        x={418}
        y={227}
        text="DIRECTIONAL O/C & E/F PROTECTION RELAY"
        fontSize={9}
      />

      <Rect
        x={418}
        y={238}
        width={307}
        height={43}
        stroke={RED}
        strokeWidth={1}
      />

      {relays.map((relay, index) => (
        <RelayCircle
          key={index}
          x={435 + index * 29}
          y={259}
          text={relay}
          radius={13}
        />
      ))}

      {/* Incoming PT arrow */}
      <Arrow
        points={[744, 259, 717, 259]}
        stroke={RED}
        fill={RED}
        strokeWidth={2}
        pointerLength={8}
        pointerWidth={8}
      />

      <Label
        x={750}
        y={249}
        text="FROM"
        fontSize={9}
      />

      <Label
        x={750}
        y={261}
        text="66 KV BUS PT"
        fontSize={9}
      />

      {/* NCT Core 2 */}
      <Arrow
        points={[704, 288, 704, 274]}
        stroke={RED}
        fill={RED}
        strokeWidth={2}
        pointerLength={7}
        pointerWidth={7}
      />

      <Label
        x={708}
        y={283}
        text="FROM"
        fontSize={8}
      />

      <Label
        x={708}
        y={295}
        text="NCT CORE-2"
        fontSize={8}
      />
    </Group>
  );
};
