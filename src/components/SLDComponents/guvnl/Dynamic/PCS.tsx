// PCS.tsx
import React from "react";
import { Group, Image as KonvaImage, Text } from "react-konva";
import { Stroke } from "../electrical/constants";
import { getSymbol } from "../symbolManager";
import PCSBase from "../Base/PCSBase";

interface PCSProps {
  x: number;
  y: number;
  label?: string;
}

export default function PCS({ x, y, label = "PCS" }: PCSProps) {
  const cachedImage = getSymbol("PCS");

  return (
    <Group x={x} y={y}>
      {cachedImage ? (
        // Render the pre-cached bitmap. 
        // x=-30, y=-25 aligns the image to match the original component's top-left bounding box.
        <KonvaImage image={cachedImage} x={-30} y={-25} />
      ) : (
        // Fallback: renders live nodes only during the split-second before preloading finishes
        <PCSBase />
      )}
      
      {/* Dynamic Label: Rendered as live text so it can be unique per instance */}
      <Text
        x={-25}
        y={40}
        width={50}
        align="center"
        text={label}
        fontSize={9}
        fontFamily="Arial"
        fill={Stroke}
      />
    </Group>
  );
}