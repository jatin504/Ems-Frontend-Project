// PCSBase.tsx
import React from "react";
import { Group, Line, Rect, Text } from "react-konva";
import { Stroke } from "../electrical/constants";

// This contains ONLY static elements. It will be rendered exactly ONCE.
export default function PCSBase() {
  return (
    <Group>
      {/* AC connection - top */}
      <Line points={[0, -25, 0, 0]} stroke={Stroke} strokeWidth={1.2} />
      
      {/* PCS body */}
      <Rect x={-30} y={0} width={60} height={58} stroke={Stroke} strokeWidth={1.2} fill="white" />
      
      {/* Diagonal: top-right -> bottom-left */}
      <Line points={[30, 0, -30, 58]} stroke={Stroke} strokeWidth={1.2} />
      
      {/* AC symbol */}
      <Text x={-21} y={8} text="~" fontSize={25} fontFamily="Arial" fill={Stroke} />
      
      {/* DC negative */}
      <Text x={14} y={10} text="−" fontSize={22} fontFamily="Arial" fill={Stroke} />
      
      {/* DC connection - bottom */}
      <Line points={[0, 58, 0, 88]} stroke={Stroke} strokeWidth={1.2} />
    </Group>
  );
}