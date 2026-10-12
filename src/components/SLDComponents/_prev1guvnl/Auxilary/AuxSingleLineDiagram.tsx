import React from "react";
import {
  Stage,
  Layer,
  Line,
  Rect,
  Text,
  Circle,
  Group,
} from "react-konva";
import Transformer from "../ICOG/Transformer";
import Breaker52 from "../PCSFeeder/Breaker52";
import ProtectionTable from "../PCSFeeder/ProtectionTable";
import MeasurementBranch from "../PCSFeeder/MeasurementBranch";
import { MeterCard } from "../PCSFeeder/MeterCard";
import Annunciator from "../Substation2/Annunciator";
import DataValueTable from "../PCSBlock/DataValueTable";
import { FONT, FONT_SIZE } from "../electrical/constants";

const RED = "#ff0000";
const BLACK = "#000000";
const BLUE = "#0000ff";
const GRAY = "#666666";

interface BusbarProps {
  x: number;
  y: number;
  width: number;
  label?: string;
}

const Busbar: React.FC<BusbarProps> = ({ x, y, width, label }) => (
  <Group>
    <Line
      points={[x, y, x + width, y]}
      stroke={RED}
      strokeWidth={1}
    />

    {label && (
      <Text
        x={x + width - 80}
        y={y + 6}
        text={label}
        fontSize={7}
        fill={BLUE}
      />
    )}
  </Group>
);

interface TransformerProps {
  x: number;
  y: number;
}

const TransformerTwoCircle: React.FC<TransformerProps> = ({ x, y }) => (
  <Group x={x} y={y}>
    {/* HV winding */}
    <Circle
      x={0}
      y={-12}
      radius={14}
      stroke={BLACK}
      strokeWidth={1}
    />

    {/* LV winding */}
    <Circle
      x={0}
      y={18}
      radius={14}
      stroke={BLACK}
      strokeWidth={1}
    />

    {/* Delta */}
    <Line
      points={[
        -7, -22,
        7, -22,
        0, -10,
        -7, -22,
      ]}
      stroke={BLACK}
      strokeWidth={1}
      closed
    />

    {/* Star / neutral */}
    <Line
      points={[0, 32, 0, 45]}
      stroke={BLACK}
      strokeWidth={1}
    />

    {/* Main conductor */}
    <Line
      points={[0, -60, 0, -26]}
      stroke={BLACK}
      strokeWidth={1}
    />

    <Line
      points={[0, 32, 0, 75]}
      stroke={BLACK}
      strokeWidth={1}
    />
  </Group>
);

interface CableProps {
  points: number[];
  color?: string;
  width?: number;
}

const Cable: React.FC<CableProps> = ({
  points,
  color = BLACK,
  width = 1,
}) => (
  <Line
    points={points}
    stroke={color}
    strokeWidth={width}
    lineCap="round"
    lineJoin="round"
  />
);

interface AnnotationProps {
  x: number;
  y: number;
  text: string;
  color?: string;
  fontSize?: number;
  width?: number;
}

const Annotation: React.FC<AnnotationProps> = ({
  x,
  y,
  text,
  color = BLACK,
  fontSize = 20,
  width = 150,
}) => (
  <Text
    x={x - 50}
    y={y}
    text={text}
    fill={color}
    fontSize={20}
    width={width}
    fontFamily={FONT}
    lineHeight={1.25}
  />
);

const AuxSingleLineDiagram: React.FC = () => {
  return (
    <Group>
      {/* RED PANEL / SWITCHGEAR BOUNDARY */}
      <Rect
        x={40}
        y={50}
        width={897}
        height={700}
        stroke={RED}
        strokeWidth={1}
      />

      {/* INCOMING FEEDERS */}
      <Line
        points={[183, 0, 183, 0]}
        stroke={BLACK}
        strokeWidth={2}
      />

      <Line
        points={[312, 0, 312, 0]}
        stroke={BLACK}
        strokeWidth={2}
      />
      
      {/* MAIN BUSBAR */}
      <Busbar
        x={134}
        y={0}
        width={220}
        // label={"33 kV, 630A, 25 kA for 1 Sec, AL\nBUSBAR"}
      />

      {/* VERTICAL FEEDER */}
      <Line
        points={[242, 0, 242, 810]}
        stroke={BLACK}
        strokeWidth={2}
      />

      {/* PROTECTION PANEL */}

      <Annunciator 
        x={250}
        y={80}
        scale={2}
      />

      <Breaker52
        x={243}
        y={360}
        scale={3}
      />

      <ProtectionTable
        x={300}
        y={240}
      />

      <MeasurementBranch
        x={225}
        y={350}
        scale={3}
      />

      {/* Meter data */}
      <MeterCard
        x={560}
        y={350}
        width={280}
        height={200}
        values={{
          P: "500 kW",
          Q: "100 kVAR",
          V: "415 V",
          I: "720 A",
          PF: "0.98",
        }}
        scale={1.2}
      />

      {/* 33kV / 110V VT */}
      <Group
        y={200}
      >
        
        <Transformer 
          x={340}
          y={440}
        />

        <DataValueTable
          x={460}
          y={400}
          title=""
          width={150}
          value={{
            OTI: 1,
            WTI: 23,
            // PRD: 45,
            // OLTC: 12,
            // TEMP: 67,
          }}
          scale={1.2}
        />

        <Annotation
          x={130}
          y={420}
          text={
            "33 kV/110 V PT\n" +
            "33kV / √3 / 110V / √3 / 110V / √3\n"
          }
          width={115}
        />
      </Group>

      {/* AUX TRANSFORMER */}
      <Annotation
        x={145}
        y={805}
        text={
          "AUX Transformer\n" +
          "250 VA, Dyn11\n" +
          "33 kV / 110V\n" +
          "±5% / 2.5% steps\n" +
          "1P, 5VA"
        }
        width={120}
      />

      <TransformerTwoCircle x={242} y={850} />

      {/* BOTTOM CABLE */}
      <Cable
        points={[242, 700, 242, 735]}
        width={1}
      />
    </Group>
  );
};

export default AuxSingleLineDiagram;
