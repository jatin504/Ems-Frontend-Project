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

type Point = {
  x: number;
  y: number;
};

const RED = "#ff0000";
const BLACK = "#000000";
const BLUE = "#0000ff";
const GRAY = "#666666";

interface SwitchProps {
  x: number;
  y: number;
  orientation?: "vertical" | "horizontal";
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({
  x,
  y,
  orientation = "vertical",
}) => {
  const vertical = orientation === "vertical";

  return (
    <Group x={x} y={y}>
      {vertical ? (
        <>
          {/* Fixed contacts */}
          <Line points={[0, -18, 0, -5]} stroke={BLACK} strokeWidth={1} />
          <Line points={[0, 5, 0, 18]} stroke={BLACK} strokeWidth={1} />

          {/* Open blade */}
          <Line
            points={[0, -5, 9, -18]}
            stroke={RED}
            strokeWidth={1.5}
          />

          {/* Red X marker */}
          <Line
            points={[-4, -4, 4, 4]}
            stroke={RED}
            strokeWidth={1.5}
          />
          <Line
            points={[4, -4, -4, 4]}
            stroke={RED}
            strokeWidth={1.5}
          />
        </>
      ) : (
        <>
          <Line points={[-18, 0, -5, 0]} stroke={BLACK} strokeWidth={1} />
          <Line points={[5, 0, 18, 0]} stroke={BLACK} strokeWidth={1} />

          <Line
            points={[-5, 0, -18, -9]}
            stroke={RED}
            strokeWidth={1.5}
          />
        </>
      )}
    </Group>
  );
};

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

interface CTProps {
  x: number;
  y: number;
}

const CT: React.FC<CTProps> = ({ x, y }) => (
  <Group x={x} y={y}>
    {/* conductor */}
    <Line points={[0, -45, 0, 45]} stroke={BLACK} strokeWidth={1} />

    {/* CT circles */}
    <Circle
      x={0}
      y={0}
      radius={11}
      stroke={BLACK}
      strokeWidth={1}
    />
    <Circle
      x={0}
      y={0}
      radius={7}
      stroke={BLACK}
      strokeWidth={1}
    />

    {/* secondary */}
    <Line points={[11, 0, 30, 0]} stroke={BLACK} strokeWidth={1} />
    <Line points={[30, 0, 30, 35]} stroke={BLACK} strokeWidth={1} />
    <Line points={[30, 35, 65, 35]} stroke={BLACK} strokeWidth={1} />
  </Group>
);

interface RelayProps {
  x: number;
  y: number;
  text?: string;
}

const Relay: React.FC<RelayProps> = ({
  x,
  y,
  text = "27/59",
}) => (
  <Group x={x} y={y}>
    <Rect
      x={0}
      y={0}
      width={32}
      height={22}
      stroke={BLACK}
      strokeWidth={1}
    />

    <Text
      x={2}
      y={5}
      width={28}
      text={text}
      fontSize={8}
      fill={BLACK}
      align="center"
    />
  </Group>
);

interface TransformerProps {
  x: number;
  y: number;
}

const Transformer: React.FC<TransformerProps> = ({ x, y }) => (
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
  color = BLUE,
  fontSize = 7,
  width = 150,
}) => (
  <Text
    x={x}
    y={y}
    text={text}
    fill={color}
    fontSize={fontSize}
    width={width}
    lineHeight={1.25}
  />
);

interface TerminalBlockProps {
  x: number;
  y: number;
}

const TerminalBlock: React.FC<TerminalBlockProps> = ({
  x,
  y,
}) => {
  const cells = Array.from({ length: 16 });

  return (
    <Group x={x} y={y}>
      <Rect
        width={65}
        height={48}
        stroke={BLACK}
        strokeWidth={1}
      />

      {cells.map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);

        return (
          <React.Fragment key={i}>
            <Rect
              x={col * 16}
              y={row * 12}
              width={16}
              height={12}
              stroke={BLACK}
              strokeWidth={0.5}
            />
            <Text
              x={col * 16}
              y={row * 12 + 2}
              width={16}
              text={`${i + 1}`}
              fontSize={5}
              align="center"
              fill={BLACK}
            />
          </React.Fragment>
        );
      })}
    </Group>
  );
};

const ProtectionPanel: React.FC = () => (
  <Group>
    {/* vertical control line */}
    <Line
      points={[242, 155, 242, 390]}
      stroke={BLACK}
      strokeWidth={1}
    />

    {/* control selector */}
    <Rect
      x={174}
      y={165}
      width={30}
      height={70}
      stroke={BLACK}
      strokeWidth={1}
    />

    <Text
      x={179}
      y={169}
      text={"R\nY\nB\nON\nOFF\nTRIP\nTEST\nSERVICE"}
      fontSize={6}
      lineHeight={1.2}
      fill={BLACK}
    />

    {/* status lamps */}
    <Circle
      x={215}
      y={225}
      radius={4}
      stroke={RED}
      strokeWidth={1}
    />

    <Circle
      x={225}
      y={225}
      radius={4}
      stroke={RED}
      strokeWidth={1}
    />

    {/* CT */}
    <CT x={242} y={275} />

    {/* CT annotation */}
    <Annotation
      x={145}
      y={260}
      text={
        "50/1-1A CT\nCORE 1: 5P20, 20VA\nCORE 2: 0.5S, CL0.5,20VA"
      }
      width={100}
    />

    {/* CT protection boxes */}
    <Rect
      x={245}
      y={295}
      width={40}
      height={25}
      stroke={BLACK}
      strokeWidth={1}
    />

    <Text
      x={249}
      y={299}
      text={"50\n51"}
      fontSize={6}
      fill={BLUE}
    />

    {/* transformer */}
    <Transformer x={242} y={390} />

    {/* relay */}
    <Relay x={355} y={410} />

    {/* secondary wiring */}
    <Cable
      points={[
        272, 275,
        330, 275,
        330, 410,
        355, 410,
      ]}
    />

    <Annotation
      x={310}
      y={180}
      text={"RS 485"}
      width={60}
    />

    <TerminalBlock x={305} y={185} />

    <Annotation
      x={305}
      y={240}
      text={"ANNUNCIATOR\n24 WINDOW"}
      width={90}
    />
  </Group>
);

const SingleLineDiagram: React.FC = () => {
  return (
    <Group>
      {/* RED PANEL / SWITCHGEAR BOUNDARY */}
      <Rect
        x={40}
        y={50}
        width={397}
        height={420}
        stroke={RED}
        strokeWidth={1}
      />

      {/* INCOMING FEEDERS */}
      <Line
        points={[183, 0, 183, 80]}
        stroke={BLACK}
        strokeWidth={1}
      />

      <Line
        points={[312, 0, 312, 80]}
        stroke={BLACK}
        strokeWidth={1}
      />

      <Switch x={183} y={85} />
      <Switch x={312} y={85} />

      <Annotation
        x={107}
        y={92}
        text={"LBS\n630 A\n26.3 kA / 3 Sec"}
        width={70}
      />

      <Annotation
        x={250}
        y={92}
        text={"LBS\n630 A\n26.3 kA / 3 Sec"}
        width={70}
      />

      {/* MAIN BUSBAR */}
      <Busbar
        x={134}
        y={154}
        width={220}
        label={"33 kV, 630A, 25 kA for 1 Sec, AL\nBUSBAR"}
      />

      {/* VERTICAL FEEDER */}
      <Line
        points={[242, 154, 242, 610]}
        stroke={BLACK}
        strokeWidth={1}
      />

      {/* PROTECTION PANEL */}
      <ProtectionPanel />

      {/* 33kV / 110V VT */}
      <Group>
        <Circle
          x={242}
          y={385}
          radius={13}
          stroke={BLACK}
          strokeWidth={1}
        />

        <Line
          points={[232, 375, 252, 395]}
          stroke={BLACK}
          strokeWidth={1}
        />

        <Line
          points={[252, 375, 232, 395]}
          stroke={BLACK}
          strokeWidth={1}
        />

        <Annotation
          x={145}
          y={380}
          text={
            "33 kV/110 V PT\n" +
            "33kV / √3 / 110V / √3 / 110V / √3\n" +
            "CL: 3P, 50VA\n" +
            "CL: 0.5, 50VA"
          }
          width={115}
        />
      </Group>

      {/* AUX TRANSFORMER */}
      <Annotation
        x={145}
        y={605}
        text={
          "AUX Transformer\n" +
          "250 VA, Dyn11\n" +
          "33 kV / 110V\n" +
          "±5% / 2.5% steps\n" +
          "1P, 5VA"
        }
        width={120}
      />

      <Transformer x={242} y={650} />

      {/* BOTTOM CABLE */}
      <Cable
        points={[242, 700, 242, 735]}
        width={1}
      />

      <Annotation
        x={215}
        y={740}
        text={"XLPE CABLE\n(1R-3.5Cx300 SQ.MM)-25M"}
        width={160}
      />

      {/* RIGHT-SIDE PROTECTION LABELS */}
      <Text
        x={315}
        y={605}
        text={"26   OTI\n49   WTI LV\n80   BUCHHOLZ\n63   PRV"}
        fontSize={8}
        fill={BLUE}
        lineHeight={1.8}
      />

      {/* BOTTOM NOTE */}
      <Annotation
        x={215}
        y={765}
        text={
          "Refer Aux. SLD\n" +
          "Document No. XXX_XXX-ELD-SLD-DWG-003"
        }
        width={200}
      />
    </Group>
  );
};

export default SingleLineDiagram;
