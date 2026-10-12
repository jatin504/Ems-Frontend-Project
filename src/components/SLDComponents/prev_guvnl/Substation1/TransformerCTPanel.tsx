import { Group, Rect } from "react-konva";
import { RED, BLUE } from "../electrical/constants";
import { Wire } from "./Wire";
import { Dot } from "./Dot";
import { Txt } from "./Txt";
import { ProtectionCircle } from "./ProtectionCircle";


export const TransformerCTPanel = ({
  x,
  y,
  title,
  core1,
  core2,
}: {
  x: number;
  y: number;
  title: string;
  core1: string;
  core2: string;
}) => {
  return (
    <Group>
      {/* Primary CT circuit */}
      <Wire points={[x - 22, y, x + 132, y]} strokeWidth={2.5} />

      <Dot x={x - 22} y={y} r={3} />
      <Dot x={x + 132} y={y} r={3} />

      {/* P1 / P2 */}
      <Txt
        x={x - 30}
        y={y - 23}
        text="P1"
        fontSize={12}
        fill={BLUE}
        bold
      />

      <Txt
        x={x + 102}
        y={y - 23}
        text="P2"
        fontSize={12}
        fill={BLUE}
        bold
      />

      {/* Core labels */}
      <Txt
        x={x + 8}
        y={y - 50}
        text={core1}
        fontSize={6}
        fill={BLUE}
        width={48}
        align="center"
      />

      <Txt
        x={x + 65}
        y={y - 50}
        text={core2}
        fontSize={6}
        fill={BLUE}
        width={48}
        align="center"
      />

      {/* Protection box */}
      <Rect
        x={x}
        y={y + 22}
        width={105}
        height={67}
        stroke={RED}
        strokeWidth={2}
        fill="#fff"
      />

      <Txt
        x={x + 5}
        y={y + 26}
        text={title}
        fontSize={6}
        fill={RED}
        width={95}
        align="center"
        bold
      />

      {/* Relay circles */}
      <ProtectionCircle x={x + 28} y={y + 58} text="64H" />
      <ProtectionCircle x={x + 75} y={y + 58} text="SEF" />

      {/* Secondary leads */}
      <Wire
        points={[x + 28, y + 69, x + 28, y + 105]}
        strokeWidth={1.8}
      />

      <Wire
        points={[x + 75, y + 69, x + 75, y + 105]}
        strokeWidth={1.8}
      />

      <Dot x={x + 28} y={y + 105} r={2.5} />
      <Dot x={x + 75} y={y + 105} r={2.5} />
    </Group>
  );
};
