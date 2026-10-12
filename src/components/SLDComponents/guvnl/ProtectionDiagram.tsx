import React from "react";
import {
  Stage,
  Layer,
  Group,
  Line,
  Circle,
  Rect,
  Text,
} from "react-konva";

const BLACK = "#111";
const BLUE = "#0000ff";
const RED = "#ff0000";

/* --------------------------------
   Generic wire
--------------------------------- */

function Wire({ points, color = BLACK, width = 1 }) {
  return (
    <Line
      points={points}
      stroke={color}
      strokeWidth={width}
      lineCap="square"
      lineJoin="miter"
    />
  );
}

/* --------------------------------
   Protection circle
--------------------------------- */

function ProtectionCircle({
  x,
  y,
  text,
  radius = 14,
}) {
  return (
    <Group x={x} y={y}>
      <Circle
        radius={radius}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={-radius}
        y={-6}
        width={radius * 2}
        text={text}
        fontSize={11}
        fontFamily="Arial"
        align="center"
        fill={BLUE}
      />
    </Group>
  );
}

/* --------------------------------
   Ground symbol
--------------------------------- */

function GroundSymbol({ x, y }) {
  return (
    <Group x={x} y={y}>
      {/* vertical connection */}
      <Wire points={[0, -18, 0, 0]} />

      {/* ground lines */}
      <Line
        points={[-12, 0, 12, 0]}
        stroke={BLACK}
        strokeWidth={1}
      />

      <Line
        points={[-8, 4, 8, 4]}
        stroke={BLACK}
        strokeWidth={1}
      />

      <Line
        points={[-4, 8, 4, 8]}
        stroke={BLACK}
        strokeWidth={1}
      />
    </Group>
  );
}

/* --------------------------------
   Breaker 52
--------------------------------- */

function Breaker52({ x, y }) {
  return (
    <Group x={x} y={y}>
      {/* breaker box */}
      <Rect
        x={-10}
        y={-10}
        width={20}
        height={20}
        stroke={RED}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={-10}
        y={-7}
        width={20}
        text="52"
        fontSize={10}
        fontFamily="Arial"
        align="center"
        fill={RED}
      />

      {/* arrows */}
      <Line
        points={[-4, -15, 0, -21, 4, -15]}
        stroke={RED}
        strokeWidth={1}
      />

      <Line
        points={[-4, 15, 0, 21, 4, 15]}
        stroke={RED}
        strokeWidth={1}
      />
    </Group>
  );
}

/* --------------------------------
   Motor M
--------------------------------- */

function MotorSymbol({ x, y }) {
  return (
    <Group x={x} y={y}>
      <Circle
        radius={14}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={-14}
        y={-6}
        width={28}
        text="M"
        fontSize={11}
        align="center"
        fill={BLUE}
      />
    </Group>
  );
}

/* --------------------------------
   Annunciator 24 window
--------------------------------- */

function Annunciator({ x, y }) {
  const numbers = [
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16,
    17, 18, 19, 20,
    21, 22, 23, 24,
  ];

  const cols = 4;
  const cellWidth = 23;
  const cellHeight = 25;

  return (
    <Group x={x} y={y}>

      {/* Grid */}
      <Rect
        width={cols * cellWidth}
        height={6 * cellHeight}
        stroke={BLUE}
        strokeWidth={1}
        fill="white"
      />

      {numbers.map((num, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        return (
          <Group key={num}>
            {/* vertical lines */}
            {col > 0 && (
              <Wire
                points={[
                  col * cellWidth,
                  0,
                  col * cellWidth,
                  6 * cellHeight,
                ]}
                color={BLUE}
              />
            )}

            {/* horizontal lines */}
            {row > 0 && (
              <Wire
                points={[
                  0,
                  row * cellHeight,
                  cols * cellWidth,
                  row * cellHeight,
                ]}
                color={BLUE}
              />
            )}

            <Text
              x={col * cellWidth}
              y={row * cellHeight + 4}
              width={cellWidth}
              text={String(num)}
              fontSize={12}
              fontFamily="Arial"
              align="center"
              fill={BLUE}
            />
          </Group>
        );
      })}

      {/* Label */}
      <Text
        x={-5}
        y={6 * cellHeight + 7}
        width={100}
        text="ANNUNCIATOR 24"
        fontSize={13}
        fontFamily="Arial"
        fill={BLUE}
      />

      <Text
        x={-5}
        y={6 * cellHeight + 22}
        width={100}
        text="WINDOW"
        fontSize={13}
        fontFamily="Arial"
        fill={BLUE}
      />

      {/* RS485 */}
      <Text
        x={100}
        y={95}
        text="RS 485"
        fontSize={13}
        fontFamily="Arial"
        fill={BLUE}
      />
    </Group>
  );
}

/* --------------------------------
   CT / grounding branch
--------------------------------- */

function CTBranch({ x, y }) {
  return (
    <Group x={x} y={y}>

      {/* vertical wire */}
      <Wire points={[0, 0, 0, 30]} />

      {/* CT circle */}
      <Circle
        x={0}
        y={35}
        radius={6}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      {/* horizontal outgoing wire */}
      <Wire
        points={[0, 35, 60, 35]}
      />

      {/* ground */}
      <GroundSymbol
        x={28}
        y={0}
      />
    </Group>
  );
}

/* --------------------------------
   Protection table
--------------------------------- */

function ProtectionTable({ x, y }) {
  const cellWidth = 38;
  const cellHeight = 29;

  const data = [
    ["50", "50N", "27"],
    ["51", "51N", "59"],
  ];

  return (
    <Group x={x} y={y}>

      <Rect
        width={cellWidth * 3}
        height={cellHeight * 2}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      {/* vertical */}
      <Wire
        points={[
          cellWidth,
          0,
          cellWidth,
          cellHeight * 2,
        ]}
      />

      <Wire
        points={[
          cellWidth * 2,
          0,
          cellWidth * 2,
          cellHeight * 2,
        ]}
      />

      {/* horizontal */}
      <Wire
        points={[
          0,
          cellHeight,
          cellWidth * 3,
          cellHeight,
        ]}
      />

      {data.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Text
            key={`${rowIndex}-${colIndex}`}
            x={colIndex * cellWidth}
            y={rowIndex * cellHeight + 6}
            width={cellWidth}
            text={value}
            fontSize={16}
            fontFamily="Arial"
            align="center"
            fill={BLACK}
          />
        ))
      )}
    </Group>
  );
}

/* --------------------------------
   MFM / BUS PT
--------------------------------- */

function MeasurementBranch({ x, y }) {
  return (
    <Group x={x} y={y}>

      {/* vertical */}
      <Wire points={[0, 0, 0, 40]} />

      {/* CT */}
      <Circle
        x={0}
        y={45}
        radius={6}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      {/* horizontal */}
      <Wire points={[0, 45, 115, 45]} />

      {/* ground */}
      <GroundSymbol x={28} y={5} />

      {/* TCP/IP */}
      <Text
        x={85}
        y={5}
        text="TCP/IP"
        fontSize={13}
        fill={BLUE}
      />

      {/* MFM */}
      <Rect
        x={68}
        y={47}
        width={36}
        height={15}
        stroke={BLUE}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={68}
        y={48}
        width={36}
        text="MFM"
        fontSize={11}
        align="center"
        fill={BLUE}
      />

      {/* BUS PT */}
      <Rect
        x={105}
        y={47}
        width={58}
        height={15}
        stroke={BLUE}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={105}
        y={48}
        width={58}
        text="BUS PT"
        fontSize={11}
        align="center"
        fill={BLUE}
      />
    </Group>
  );
}

/* --------------------------------
   87T Differential protection
--------------------------------- */

function Differential87T({ x, y }) {
  return (
    <Group x={x} y={y}>

      {/* incoming vertical */}
      <Wire points={[0, 0, 0, 35]} />

      {/* CT */}
      <Circle
        x={0}
        y={40}
        radius={6}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      {/* outgoing wire */}
      <Wire
        points={[
          0,
          40,
          95,
          40,
          95,
          220,
        ]}
      />

      {/* ground */}
      <GroundSymbol
        x={28}
        y={5}
      />

      {/* 87T */}
      <ProtectionCircle
        x={115}
        y={40}
        text="87T"
        radius={18}
      />
    </Group>
  );
}

/* --------------------------------
   Main diagram
--------------------------------- */

export default function ProtectionDiagram() {
  return (
    <Stage
      width={450}
      height={800}
    >
      <Layer>

        {/* ========================
             MAIN LEFT CONTROL LINE
        ========================= */}

        <Wire
          points={[
            33,
            0,
            33,
            800,
          ]}
          width={1.2}
        />

        {/* ========================
                  52
        ========================= */}

        <Breaker52
          x={33}
          y={255}
        />

        {/* ========================
              M / 94 / 95 / 86
        ========================= */}

        <Wire
          points={[
            33,
            255,
            70,
            255,
          ]}
        />

        <MotorSymbol
          x={84}
          y={255}
        />

        <Wire
          points={[
            98,
            255,
            112,
            255,
          ]}
        />

        <ProtectionCircle
          x={127}
          y={255}
          text="94"
        />

        <Wire
          points={[
            141,
            255,
            157,
            255,
          ]}
        />

        <ProtectionCircle
          x={171}
          y={255}
          text="95"
        />

        <Wire
          points={[
            185,
            255,
            200,
            255,
          ]}
        />

        <ProtectionCircle
          x={215}
          y={255}
          text="86"
        />

        {/* ========================
             ANNUNCIATOR
        ========================= */}

        <Annunciator
          x={145}
          y={32}
        />

        {/* ========================
             50 / 51 PROTECTION
        ========================= */}

        <CTBranch
          x={33}
          y={300}
        />

        <ProtectionTable
          x={100}
          y={322}
        />

        {/* ========================
             MFM / BUS PT
        ========================= */}

        <MeasurementBranch
          x={33}
          y={390}
        />

        {/* ========================
                  87T
        ========================= */}

        <Differential87T
          x={33}
          y={500}
        />

        {/* ========================
             BOTTOM RED LINE
        ========================= */}

        <Wire
          points={[
            0,
            778,
            430,
            778,
          ]}
          color={RED}
          width={1}
        />

      </Layer>
    </Stage>
  );
}
