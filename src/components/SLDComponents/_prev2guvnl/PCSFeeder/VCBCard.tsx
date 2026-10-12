/* =========================================================
   VCB STATUS CARD
   ========================================================= */

import { Circle, Group, Rect, Text } from "react-konva";
import { BLUE } from "../electrical/constants";

interface VCBStatusProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export const VCBStatusCard: React.FC<VCBStatusProps> = ({
  x,
  y,
  width = 260,
  height = 190,
}) => {
  const statuses = [
    {
      label: "Open",
      color: "#22C55E",
      active: true,
    },
    {
      label: "Close",
      color: "#22C55E",
      active: false,
    },
    {
      label: "Trip",
      color: "#EF4444",
      active: false,
    },
  ];

  return (
    <Group x={x} y={y}>

      {/* Main card */}
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
        text="VCB STATUS"
        fontSize={14}
        fontFamily="Arial"
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

      {/* Status rows */}
      {statuses.map((status, index) => {
        const rowY = 52 + index * 30;

        return (
          <Group key={status.label}>

            {/* Status bubble */}
            <Circle
              x={27}
              y={rowY + 8}
              radius={7}
              fill={
                status.active
                  ? status.color
                  : "#FFFFFF"
              }
              stroke={status.color}
              strokeWidth={2}
            />

            {/* Status label */}
            <Text
              x={42}
              y={rowY}
              text={status.label}
              fontSize={25}
              fontFamily="Arial"
              fill={BLUE}
            />

          </Group>
        );
      })}

      {/* =================================================
          CONTROL BUTTONS
          ================================================= */}

      <Group
        x={width - 82}
        y={52}
      >

        {/* OPEN */}
        <Rect
          x={0}
          y={0}
          width={65}
          height={38}
          cornerRadius={8}
          fill="#FFFFFF"
          stroke="#22C55E"
          strokeWidth={2}
        />

        <Text
          x={0}
          y={13}
          width={65}
          text="Open"
          fontSize={20}
          fontFamily="Arial"
          fontStyle="bold"
          align="center"
          fill="#22C55E"
        />

        {/* CLOSE */}
        <Rect
          x={0}
          y={58}
          width={65}
          height={38}
          cornerRadius={8}
          fill="#22C55E"
          stroke="#22C55E"
          strokeWidth={2}
        />

        <Text
          x={0}
          y={71}
          width={65}
          text="Close"
          fontSize={20}
          fontFamily="Arial"
          fontStyle="bold"
          align="center"
          fill="#FFFFFF"
        />

      </Group>
    </Group>
  );
};