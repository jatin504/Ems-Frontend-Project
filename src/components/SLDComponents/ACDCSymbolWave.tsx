import React from "react";
import { Group, Shape } from "react-konva";

interface ACDCSymbolWaveProps {
  x: number;
  y: number;
  isDraggable?: boolean;
}

const ACDCSymbolWave: React.FC<ACDCSymbolWaveProps> = ({
  x,
  y,
  isDraggable = false,
}) => {
  return (
    <Group
      x={x}
      y={y}
      draggable={isDraggable}
      dragBoundFunc={(pos) => {
        return {
          x: pos.x,
          y: Math.max(pos.y, 0),
        };
      }}
      onDragEnd={(e) => {
        const newX = e.target.x();
        const newY = e.target.y();
        console.log("ACDCSymbolWave dragged to:", newX, newY);
      }}
    >
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          // Bottom wave
          ctx.moveTo(0, 60);
          ctx.lineTo(0, 46);
          ctx.bezierCurveTo(0, 41.58, 3.58, 38, 8, 38);
          ctx.bezierCurveTo(12.42, 38, 16, 41.58, 16, 46);
          ctx.bezierCurveTo(16, 41.58, 19.58, 38, 24, 38);
          ctx.bezierCurveTo(28.42, 38, 32, 41.58, 32, 46);
          ctx.bezierCurveTo(32, 41.58, 35.58, 38, 40, 38);
          ctx.bezierCurveTo(44.42, 38, 48, 41.58, 48, 46);
          ctx.bezierCurveTo(48, 41.58, 51.58, 38, 56, 38);
          ctx.bezierCurveTo(60.42, 38, 64, 41.58, 64, 46);
          ctx.lineTo(64, 60);
          ctx.strokeStyle = "red";
          ctx.stroke();

          ctx.beginPath();
          // Top wave
          ctx.moveTo(0, 0);
          ctx.lineTo(0, 14);
          ctx.bezierCurveTo(0, 18.42, 3.58, 22, 8, 22);
          ctx.bezierCurveTo(12.42, 22, 16, 18.42, 16, 14);
          ctx.bezierCurveTo(16, 18.42, 19.58, 22, 24, 22);
          ctx.bezierCurveTo(28.42, 22, 32, 18.42, 32, 14);
          ctx.bezierCurveTo(32, 18.42, 35.58, 22, 40, 22);
          ctx.bezierCurveTo(44.42, 22, 48, 18.42, 48, 14);
          ctx.bezierCurveTo(48, 18.42, 51.58, 22, 56, 22);
          ctx.bezierCurveTo(60.42, 22, 64, 18.42, 64, 14);
          ctx.lineTo(64, 0);
          ctx.strokeStyle = "darkgreen";
          ctx.stroke();
        }}
        strokeWidth={5}
        hitStrokeWidth={20}
      />
    </Group>
  );
};

export default ACDCSymbolWave;
