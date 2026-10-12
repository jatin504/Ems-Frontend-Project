import { Group, Rect } from "react-konva";

import { RED } from "../electrical/constants";
import { Txt } from "./Txt";
import { Wire } from "./Wire";
import { Relay } from "./Relay";
import { SmallTable } from "./SmallTable";
import type { Point } from "./types";

export const RelayPanel = ({ x, y }: Point) => {
  return (
    <Group>
      <Rect
        x={x}
        y={y}
        width={198}
        height={276}
        stroke={RED}
        strokeWidth={2}
        dash={[9, 7]}
      />

      <Txt
        x={x + 72}
        y={y + 3}
        text="PROTECTION"
        fontSize={8}
        fill={RED}
        bold
      />

      <Txt
        x={x + 91}
        y={y + 17}
        text="CONTROL PANEL"
        fontSize={7}
        fill={RED}
        bold
      />

      <Relay x={x + 36} y={y + 35} text="50" />
      <Relay x={x + 58} y={y + 35} text="51" />
      <Relay x={x + 80} y={y + 35} text="50N" />
      <Relay x={x + 103} y={y + 35} text="51N" />

      <Wire
        points={[x + 26, y + 35, x + 113, y + 35]}
        strokeWidth={1.5}
      />

      <SmallTable
        x={x + 126}
        y={y + 25}
        width={54}
        height={60}
        rows={4}
        cols={4}
      />

      <Txt
        x={x + 122}
        y={y + 3}
        text="TB"
        fontSize={7}
        fill={RED}
        width={60}
        align="center"
      />

      <Relay x={x + 36} y={y + 144} text="27" />
      <Relay x={x + 58} y={y + 144} text="59" />
      <Relay x={x + 80} y={y + 144} text="27" />
      <Relay x={x + 103} y={y + 144} text="59" />

      <SmallTable
        x={x + 127}
        y={y + 112}
        width={53}
        height={40}
        rows={2}
        cols={4}
      />

      <Wire
        points={[
          x + 36,
          y + 155,
          x + 36,
          y + 190,
          x + 145,
          y + 190,
        ]}
        strokeWidth={1.8}
      />

      <Wire
        points={[
          x + 103,
          y + 45,
          x + 103,
          y + 74,
          x + 145,
          y + 74,
        ]}
        strokeWidth={1.8}
      />

      <Wire
        points={[x + 48, y + 190, x + 198, y + 190]}
        strokeWidth={1.8}
      />

      <Txt
        x={x + 130}
        y={y + 185}
        text="TRIP / ALARM"
        fontSize={8}
        fill={RED}
        bold
      />

      <Relay x={x + 35} y={y + 170} text="86" radius={8} />
      <Relay x={x + 58} y={y + 170} text="94" radius={8} />
      <Relay x={x + 81} y={y + 170} text="T" radius={8} />

      <Txt
        x={x + 128}
        y={y + 215}
        text="TRIP FROM"
        fontSize={8}
        fill={RED}
        bold
      />

      <Txt
        x={x + 128}
        y={y + 228}
        text="TRANSFORMER"
        fontSize={8}
        fill={RED}
        bold
      />

      <SmallTable
        x={x + 28}
        y={y + 222}
        width={60}
        height={32}
        rows={2}
        cols={4}
      />
    </Group>
  );
};
