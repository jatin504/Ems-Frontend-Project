import React from "react";
import {
  Group,
  Line,
  Rect,
  Text,
} from "react-konva";

interface BatteryContainerProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  scale?: number;

  soc?: number | any;
  temperature?: number | any;
}

const BESS_GREEN = "#22C55E";

export default function BatteryContainer({
  x,
  y,
  width = 150,
  height = 75,
  scale = 1,
  soc = 85.01,
  temperature = 27.6,
}: BatteryContainerProps) {

  const radius = Math.min(width, height) * 0.12;

  const strokeWidth = Math.max(
    1.2,
    width * 0.008
  );

  // =====================================================
  // FONT SIZES
  // =====================================================

  const titleFontSize = Math.max(
    25,
    width * 0.075
  );

  const labelFontSize = Math.max(
    25,
    width * 0.055
  );

  const valueFontSize = Math.max(
    30,
    width * 0.075
  );

  // =====================================================
  // TITLE
  // =====================================================

  const titleText = "BESS Container";

  const titleWidth = width * 0.55;

  const titleX =
    (width - titleWidth) / 2;

  const titleBackgroundPadding =
    width * 0.025;

  // =====================================================
  // ROW LAYOUT
  // =====================================================

  const labelX = width * 0.10;

  const valueX = width * 0.48;

  const valueWidth = width * 0.42;

  const row1Y = height * 0.34;

  const row2Y = height * 0.62;

  return (
    <Group
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
    >

      {/* =================================================
          OUTER CONTAINER
      ================================================= */}

      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        cornerRadius={radius}
        stroke={BESS_GREEN}
        strokeWidth={strokeWidth}
        // fill="white"
      />

      {/* =================================================
          TITLE MASK
      ================================================= */}

      <Rect
        x={
          titleX -
          titleBackgroundPadding
        }
        y={-strokeWidth}
        width={
          titleWidth +
          titleBackgroundPadding * 2
        }
        height={
          titleFontSize +
          strokeWidth * 2
        }
        fill="white"
        listening={false}
      />

      {/* =================================================
          TITLE
      ================================================= */}

      <Text
        x={titleX}
        y={-titleFontSize * 0.42}
        width={titleWidth}
        text={titleText}
        fontSize={titleFontSize}
        fontFamily="Arial"
        fontStyle="bold"
        align="center"
        fill={BESS_GREEN}
        listening={false}
      />

      {/* =================================================
          TOP BORDER
      ================================================= */}

      <Line
        points={[
          radius,
          0,
          titleX - titleBackgroundPadding,
          0,
        ]}
        stroke={BESS_GREEN}
        strokeWidth={strokeWidth}
        lineCap="round"
      />

      <Line
        points={[
          titleX +
            titleWidth +
            titleBackgroundPadding,
          0,
          width - radius,
          0,
        ]}
        stroke={BESS_GREEN}
        strokeWidth={strokeWidth}
        lineCap="round"
      />

      {/* =================================================
          ROW 1 - SOC
      ================================================= */}

      <Text
        x={labelX}
        y={row1Y}
        text="SoC"
        fontSize={labelFontSize}
        fontFamily="Arial"
        fill="#64748B"
      />

      <Text
        x={valueX}
        y={row1Y}
        width={valueWidth}
        text={`${soc.toFixed(2)}%`}
        fontSize={valueFontSize}
        fontFamily="Arial"
        fontStyle="bold"
        fill="#1E293B"
        align="right"
      />

      {/* =================================================
          ROW 2 - TEMPERATURE
      ================================================= */}

      <Text
        x={labelX}
        y={row2Y}
        text="Temp"
        fontSize={labelFontSize}
        fontFamily="Arial"
        fill="#64748B"
      />

      <Text
        x={valueX}
        y={row2Y}
        width={valueWidth}
        text={`${temperature.toFixed(1)}°C`}
        fontSize={valueFontSize}
        fontFamily="Arial"
        fontStyle="bold"
        fill="#1E293B"
        align="right"
      />

    </Group>
  );
}
