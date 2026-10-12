/* =========================================================
   METER CARD
   ========================================================= */

import { Group, Rect, Text } from "react-konva";
import { BLACK, BLUE, BUS_GREEN, FONT } from "../electrical/constants";

interface MeterCardProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  values?: {
    P: string;
    Q: string;
    V: string;
    I: string;
    PF: string;
  };
  scale?: number;
}

export const MeterCard: React.FC<MeterCardProps> = ({
  x,
  y,
  width = 240,
  height = 190,
  values = {
    P: "500 kW",
    Q: "100 kVAR",
    V: "415 V",
    I: "720 A",
    PF: "0.98",
  },
  scale=1,
}) => {
  const rows = [
    ["P", values.P],
    ["Q", values.Q],
    ["V", values.V],
    ["I", values.I],
    ["PF", values.PF],
  ];

  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>

      {/* Card */}
      <Rect
        width={width}
        height={height}
        cornerRadius={12}
        fill="#FFFFFF"
        stroke={BLUE}
        strokeWidth={1.5}
        shadowColor="#000000"
        shadowBlur={6}
        shadowOffset={{
          x: 0,
          y: 2,
        }}
        shadowOpacity={0.15}
      />

      {/* Title */}
      <Text
        x={15}
        y={12}
        width={width - 30}
        text="MEASUREMENT"
        fontSize={14}
        fontFamily={FONT}
        fontStyle="bold"
        fill={BLUE}
      />

      {/* Divider */}
      <Rect
        x={15}
        y={36}
        width={width - 30}
        height={1}
        fill={BLUE}
        opacity={0.3}
      />

      {rows.map(([label, value], index) => {
        const rowY = 47 + index * 30;

        return (
          <Group key={label}>

            {/* Label */}
            <Text
              x={18}
              y={rowY}
              width={40}
              text={label}
              fontSize={25}
              fontFamily={FONT}
              fontStyle="bold"
              fill={BLUE}
            />

            {/* Value */}
            <Text
              x={65}
              y={rowY - 1}
              width={width - 80}
              text={value}
              fontSize={30}
              fontFamily={FONT}
              fontStyle="bold"
              align="right"
              fill={BUS_GREEN}
            />

          </Group>
        );
      })}
    </Group>
  );
};