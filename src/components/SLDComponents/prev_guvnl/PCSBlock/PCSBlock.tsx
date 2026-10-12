import React from "react";
import {
  Group,
  Line,
  Text,
} from "react-konva";

import Breaker from "../electrical/Breaker";
import BatteryContainer from "../electrical/BatteryContainer";
import PCS from "../electrical/PCS";
import Wire from "../electrical/Wire";
import Busbar from "../electrical/Busbar";
import TransformerLabel from "../electrical/TransformerLabel";
import Transformer from "../electrical/transformer";
import { ORANGE } from "../electrical/constants";

interface PCSItem {
  x: number;
  label: string;
}

interface PCSBlockProps {
  x?: number;
  y?: number;
  count?: number;
}

export const PCSBlock: React.FC<PCSBlockProps> = ({
  x = 0,
  y = 0,
  count = 4,
}) => {
  const transformerX = 170;
  const transformerY = 65;

  const busY = 195;

  // =========================
  // PCS / Battery positioning
  // =========================

  const pcsStartX = 0;
  const pcsSpacing = 120;

  // Make sure count is at least 1
  const pcsCount = Math.max(1, count);

  const pcsX: number[] = Array.from(
    { length: pcsCount },
    (_, index) => pcsStartX + index * pcsSpacing
  );

  const pcs: PCSItem[] = pcsX.map((pcsXValue, index) => ({
    x: pcsXValue,
    label: `PCS ${index + 1}`,
  }));

  // Busbar width follows the number of PCS
  const busWidth =
    pcsCount > 1
      ? pcsX[pcsX.length - 1] - pcsStartX
      : 0;

  return (
    <Group x={x} y={y}>

      {/* =========================
          Transformer information
          ========================= */}

      <TransformerLabel
        x={8}
        y={30}
      />

      {/* Transformer */}

      <Transformer
        x={transformerX}
        y={transformerY}
      />

      {/* Transformer values */}

      <Text
        x={transformerX + 60}
        y={transformerY - 30}
        text="0.690 kV"
        fontSize={12}
        fill={ORANGE}
      />

      <Text
        x={transformerX + 60}
        y={transformerY - 3}
        text="50 Hz"
        fontSize={12}
        fill={ORANGE}
      />

      {/* =========================
          Transformer connections
          ========================= */}

      <Wire
        points={[
          transformerX - 40,
          transformerY + 55,
          transformerX - 40,
          busY,
          pcsX[0],
          busY,
        ]}
      />

      <Wire
        points={[
          transformerX - 12,
          transformerY + 58,
          transformerX - 12,
          busY,
        ]}
      />

      <Wire
        points={[
          transformerX + 12,
          transformerY + 58,
          transformerX + 12,
          busY,
        ]}
      />

      <Wire
        points={[
          transformerX + 40,
          transformerY + 55,
          transformerX + 40,
          busY,
          pcsX[pcsX.length - 1],
          busY,
        ]}
      />

      {/* =========================
          Main busbar
          ========================= */}

      <Busbar
        x={pcsStartX}
        y={busY}
        width={busWidth}
      />

      {/* =========================
          PCS + Battery Banks
          ========================= */}

      {pcs.map((item, index) => {
        const pcsY = 245;

        // Battery position
        const batteryX = item.x - 40;
        const batteryY = pcsY + 150;

        return (
          <Group key={index}>

            {/* =========================
                Busbar -> Breaker
                ========================= */}

            <Wire
              points={[
                item.x,
                busY,
                item.x,
                busY + 22,
              ]}
            />

            <Breaker
              x={item.x}
              y={busY + 22}
            />

            <Wire
              points={[
                item.x,
                busY + 57,
                item.x,
                pcsY,
              ]}
            />

            {/* =========================
                PCS
                ========================= */}

            <PCS
              x={item.x}
              y={pcsY}
              label={item.label}
            />

            {/* PCS values */}

            <Text
              x={item.x + 40}
              y={pcsY + 10}
              text="500 kW"
              fontSize={12}
              fill={ORANGE}
            />

            <Text
              x={item.x + 40}
              y={pcsY + 25}
              text="100"
              fontSize={12}
              fill={ORANGE}
            />

            <Text
              x={item.x + 40}
              y={pcsY + 40}
              text="50 Hz"
              fontSize={12}
              fill={ORANGE}
            />

            {/* =========================
                Battery Bank
                ========================= */}

            <BatteryContainer
              x={batteryX}
              y={batteryY}
              width={180}
              height={145}
              racks={3}
              scale={0.45}
            />

            {/* Battery values */}

            <Text
              x={batteryX + 85}
              y={batteryY + 10}
              text="500 kW"
              fontSize={10}
              fill={ORANGE}
            />

            <Text
              x={batteryX + 85}
              y={batteryY + 25}
              text="100"
              fontSize={10}
              fill={ORANGE}
            />

            <Text
              x={batteryX + 85}
              y={batteryY + 40}
              text="50 Hz"
              fontSize={10}
              fill={ORANGE}
            />

            {/* =========================
                PCS -> Battery
                ========================= */}

            <Line
              points={[
                item.x,
                pcsY + 88,
                item.x,
                batteryY,
              ]}
              stroke="#111"
              strokeWidth={1.5}
            />

          </Group>
        );
      })}
    </Group>
  );
};
