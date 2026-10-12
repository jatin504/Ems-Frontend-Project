import React from "react";
import {
  Stage,
  Layer,
  Group,
  Line,
  Rect,
  Circle,
  Text,
  Arc,
} from "react-konva";

/* =========================================================
   Basic helpers
========================================================= */

const BlueText = ({ x, y, text, fontSize = 14, ...props }) => (
  <Text
    x={x}
    y={y}
    text={text}
    fontSize={fontSize}
    fill="#0000ff"
    fontFamily="Arial"
    {...props}
  />
);

const Wire = ({ points, stroke = "#222", strokeWidth = 1.5, ...props }) => (
  <Line
    points={points}
    stroke={stroke}
    strokeWidth={strokeWidth}
    lineCap="round"
    lineJoin="round"
    {...props}
  />
);

/* =========================================================
   Vertical feeder / bus
========================================================= */

const VerticalBus = ({ x = 188, height = 690 }) => (
  <Line
    points={[x, 0, x, height]}
    stroke="#222"
    strokeWidth={1.2}
  />
);

/* =========================================================
   Surge Arrester
========================================================= */

const SurgeArrester = ({ x, y }) => (
  <Group x={x} y={y}>
    <Circle radius={4} stroke="#ff00ff" strokeWidth={1} />
    <Line
      points={[0, 4, 0, 16]}
      stroke="#ff00ff"
      strokeWidth={1}
    />
    <Line
      points={[-5, 8, 5, 8]}
      stroke="#ff00ff"
      strokeWidth={1}
    />
    <Line
      points={[-3, 16, 3, 16]}
      stroke="#ff00ff"
      strokeWidth={1}
    />

    <BlueText x={-9} y={-16} text="TNC" fontSize={9} />
  </Group>
);

/* =========================================================
   Small equipment symbol
========================================================= */

const EquipmentSymbol = ({ x, y }) => (
  <Group x={x} y={y}>
    <Rect
      x={-14}
      y={-6}
      width={28}
      height={12}
      stroke="#00d9ff"
      strokeWidth={1}
    />

    <Line
      points={[-14, -6, 14, 6]}
      stroke="#00d9ff"
      strokeWidth={1}
    />

    <Line
      points={[14, -6, -14, 6]}
      stroke="#00d9ff"
      strokeWidth={1}
    />

    <Line
      points={[14, 0, 38, 0]}
      stroke="#00d9ff"
      strokeWidth={1}
    />

    <Line
      points={[38, -4, 44, 0, 38, 4]}
      stroke="#00d9ff"
      strokeWidth={1}
    />
  </Group>
);

/* =========================================================
   PT - Potential Transformer
========================================================= */

const LinePT = ({ x, y }) => (
  <Group x={x} y={y}>
    <BlueText x={-155} y={-45} text="33 kV LINE PT" />

    <BlueText x={-155} y={-20} text="33kV" />
    <BlueText x={-80} y={-20} text="110V" />
    <BlueText x={-15} y={-20} text="110V" />

    <BlueText x={-155} y={2} text="√3" />
    <BlueText x={-80} y={2} text="√3" />
    <BlueText x={-15} y={2} text="√3" />

    <Wire points={[-120, -5, -60, -5]} />
    <Wire points={[-45, -5, 0, -5]} />

    <BlueText x={-155} y={28} text="CL: 3P, 50VA" fontSize={12} />
    <BlueText x={-155} y={47} text="CL: 0.2, 50VA" fontSize={12} />

    {/* PT symbol */}
    <Circle x={0} y={95} radius={16} stroke="#222" />
    <Circle x={28} y={95} radius={16} stroke="#222" />

    <Wire points={[-15, 95, 44, 95]} />
    <Wire points={[14, 79, 14, 111]} />
    <Wire points={[14, 95, 28, 95]} />

    {/* Connection to relay */}
    <Wire points={[44, 95, 44, 70, 95, 70]} />
    <Wire points={[95, 70, 95, 50]} />
  </Group>
);

/* =========================================================
   Transformer / protection transformer
========================================================= */

const Transformer = ({ x, y }) => (
  <Group x={x} y={y}>
    <Circle x={0} y={0} radius={17} stroke="#222" />
    <Circle x={27} y={0} radius={17} stroke="#222" />

    {/* winding indications */}
    <Arc
      x={0}
      y={0}
      innerRadius={6}
      outerRadius={13}
      angle={180}
      rotation={-90}
      stroke="#222"
    />

    <Arc
      x={27}
      y={0}
      innerRadius={6}
      outerRadius={13}
      angle={180}
      rotation={90}
      stroke="#222"
    />

    {/* top connection */}
    <Wire points={[13, -17, 13, -28, 75, -28]} />

    {/* bottom connection */}
    <Wire points={[40, 17, 40, 40, 90, 40, 90, 180]} />

    {/* ground / terminal marks */}
    <Line points={[-7, -20, -7, -28]} stroke="#222" />
    <Line points={[-12, -28, -2, -28]} stroke="#222" />

    <Line points={[47, 20, 47, 28]} stroke="#222" />
    <Line points={[42, 28, 52, 28]} stroke="#222" />
  </Group>
);

/* =========================================================
   Relay block
========================================================= */

const RelayBlock = ({ x, y }) => (
  <Group x={x} y={y}>
    <Rect
      x={0}
      y={0}
      width={60}
      height={36}
      stroke="#222"
      strokeWidth={1}
      fill="#fff"
    />

    <Line points={[30, 0, 30, 36]} stroke="#222" />

    <Text
      x={5}
      y={7}
      text="50"
      fontSize={14}
      fill="#222"
    />

    <Text
      x={35}
      y={7}
      text="50N"
      fontSize={14}
      fill="#222"
    />

    <Text
      x={5}
      y={22}
      text="51"
      fontSize={14}
      fill="#222"
    />

    <Text
      x={35}
      y={22}
      text="51N"
      fontSize={14}
      fill="#222"
    />
  </Group>
);

/* =========================================================
   CT
========================================================= */

const CT = ({ x, y }) => (
  <Group x={x} y={y}>
    {/* CT circles */}
    <Circle x={0} y={0} radius={5} stroke="#222" />
    <Circle x={7} y={0} radius={5} stroke="#222" />

    {/* core / earth indication */}
    <Line points={[0, -5, 0, -18]} stroke="#222" />

    <Line points={[-8, -18, 8, -18]} stroke="#222" />
    <Line points={[-5, -22, 5, -22]} stroke="#222" />

    <Wire points={[12, 0, 55, 0]} />
  </Group>
);

/* =========================================================
   CT Specification
========================================================= */

const CTSpecification = ({ x, y }) => (
  <Group x={x} y={y}>
    <BlueText x={0} y={0} text="33kV CT" />
    <BlueText x={0} y={18} text="700/1-1-1 A" fontSize={12} />

    <BlueText x={0} y={42} text="CORE-1" fontSize={12} />
    <BlueText x={0} y={60} text="CL 5P20, 20VA" fontSize={12} />

    <BlueText x={0} y={78} text="CORE-2" fontSize={12} />
    <BlueText x={0} y={96} text="CL 0.5S, 20VA" fontSize={12} />

    <BlueText x={0} y={114} text="CORE-3" fontSize={12} />
    <BlueText x={0} y={132} text="CL 5P20, 20VA" fontSize={12} />
  </Group>
);

/* =========================================================
   Multifunction Meter
========================================================= */

const MultifunctionMeter = ({ x, y }) => (
  <Group x={x} y={y}>
    <Rect
      width={40}
      height={20}
      stroke="#222"
      fill="#fff"
    />

    <Text
      x={5}
      y={3}
      text="MFM"
      fontSize={12}
      fill="#0000ff"
    />

    <BlueText x={-5} y={28} text="TCP/IP" fontSize={12} />
  </Group>
);

/* =========================================================
   Spare CT
========================================================= */

const SpareCT = ({ x, y }) => (
  <Group x={x} y={y}>
    <Circle x={0} y={0} radius={5} stroke="#222" />
    <Circle x={7} y={0} radius={5} stroke="#222" />

    <Line points={[0, -5, 0, -18]} stroke="#222" />
    <Line points={[-8, -18, 8, -18]} stroke="#222" />
    <Line points={[-5, -22, 5, -22]} stroke="#222" />

    <Wire points={[12, 0, 55, 0]} />

    <BlueText x={65} y={-7} text="SPARE" />
  </Group>
);

/* =========================================================
   Annunciator
========================================================= */

const Annunciator = ({ x, y }) => {
  const numbers = ["8", "7", "6", "5", "1", "2", "3", "4"];

  return (
    <Group x={x} y={y}>
      <BlueText x={0} y={-25} text="RS 485" />

      <Rect
        width={80}
        height={40}
        stroke="#222"
        fill="#fff"
      />

      {numbers.map((n, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);

        return (
          <Group key={n}>
            <Text
              x={col * 20 + 6}
              y={row * 20 + 2}
              text={n}
              fontSize={13}
              fill="#0000ff"
            />

            {col > 0 && (
              <Line
                points={[col * 20, row * 20, col * 20, row * 20 + 20]}
                stroke="#222"
              />
            )}
          </Group>
        );
      })}

      <Line points={[0, 20, 80, 20]} stroke="#222" />

      <BlueText
        x={0}
        y={48}
        text="ANNUNCIATOR"
        fontSize={12}
      />

      <BlueText
        x={0}
        y={65}
        text="8 WINDOW"
        fontSize={12}
      />
    </Group>
  );
};

/* =========================================================
   Protection numbers: 27 / 59
========================================================= */

const ProtectionFunctions = ({ x, y }) => (
  <Group x={x} y={y}>
    <Rect
      width={50}
      height={30}
      cornerRadius={15}
      stroke="#222"
      fill="#fff"
    />

    <Circle
      x={13}
      y={15}
      radius={10}
      stroke="#222"
      fill="#fff"
    />

    <Circle
      x={37}
      y={15}
      radius={10}
      stroke="#222"
      fill="#fff"
    />

    <Text
      x={5}
      y={8}
      text="27"
      fontSize={12}
      fill="#0000ff"
    />

    <Text
      x={29}
      y={8}
      text="59"
      fontSize={12}
      fill="#0000ff"
    />
  </Group>
);

/* =========================================================
   Circuit Breaker
========================================================= */

const CircuitBreaker = ({ x, y }) => (
  <Group x={x} y={y}>
    <Line
      points={[0, -18, 0, 18]}
      stroke="#ff0000"
      strokeWidth={2}
    />

    <Line
      points={[6, -18, 6, 18]}
      stroke="#ff0000"
      strokeWidth={2}
    />

    <Line
      points={[0, -8, 6, -14]}
      stroke="#ff0000"
      strokeWidth={2}
    />

    <Rect
      x={-6}
      y={-7}
      width={12}
      height={14}
      stroke="#222"
      fill="#fff"
    />

    <Text
      x={-4}
      y={-5}
      text="52"
      fontSize={7}
      fill="#222"
    />
  </Group>
);

/* =========================================================
   Motor
========================================================= */

const Motor = ({ x, y }) => (
  <Group x={x} y={y}>
    <Circle radius={12} stroke="#222" />

    <Text
      x={-5}
      y={-6}
      text="M"
      fontSize={13}
      fill="#222"
    />

    <Circle
      x={30}
      y={0}
      radius={10}
      stroke="#222"
    />

    <Text
      x={23}
      y={-6}
      text="95"
      fontSize={11}
      fill="#0000ff"
    />

    <Circle
      x={52}
      y={0}
      radius={10}
      stroke="#222"
    />

    <Text
      x={45}
      y={-6}
      text="94"
      fontSize={11}
      fill="#0000ff"
    />

    <Circle
      x={74}
      y={0}
      radius={10}
      stroke="#222"
    />

    <Text
      x={67}
      y={-6}
      text="86"
      fontSize={11}
      fill="#0000ff"
    />
  </Group>
);

/* =========================================================
   Bottom specification
========================================================= */

const MotorSpecification = ({ x, y }) => (
  <Group x={x} y={y}>
    <BlueText x={0} y={0} text="33kV,50Hz, 3P," fontSize={12} />
    <BlueText x={0} y={17} text="VCB,1250 A" fontSize={12} />
    <BlueText x={0} y={34} text="26.3kA for 3 sec ," fontSize={12} />
    <BlueText x={0} y={51} text="EDO type" fontSize={12} />
  </Group>
);

/* =========================================================
   Main Diagram
========================================================= */

const Protection2 = () => {
  const BUS_X = 188;

  return (
    <Stage width={550} height={700}>
      <Layer>

        {/* Main vertical conductor */}
        <VerticalBus x={BUS_X} height={700} />

        {/* -----------------------------------------------
            Top section
        ------------------------------------------------ */}

        <SurgeArrester x={10} y={68} />

        <BlueText x={70} y={43} text="SA" />
        <BlueText x={70} y={61} text="30kV, 10 kA" fontSize={12} />
        <BlueText x={70} y={78} text="Class II" fontSize={12} />

        <EquipmentSymbol x={222} y={52} />

        <Annunciator x={350} y={40} />

        {/* -----------------------------------------------
            PT section
        ------------------------------------------------ */}

        <LinePT x={218} y={70} />

        {/* -----------------------------------------------
            Transformer
        ------------------------------------------------ */}

        <Transformer x={205} y={167} />

        <ProtectionFunctions x={326} y={122} />

        {/* -----------------------------------------------
            CT + protection relay
        ------------------------------------------------ */}

        <CT x={188} y={310} />

        <RelayBlock x={220} y={300} />

        {/* -----------------------------------------------
            CT specification
        ------------------------------------------------ */}

        <CTSpecification x={68} y={319} />

        {/* -----------------------------------------------
            MFM section
        ------------------------------------------------ */}

        <CT x={188} y={388} />

        <MultifunctionMeter x={230} y={378} />

        {/* wire from transformer to MFM */}
        <Wire
          points={[
            233, 207,
            323, 207,
            323, 388,
            270, 388,
          ]}
        />

        {/* -----------------------------------------------
            Spare
        ------------------------------------------------ */}

        <SpareCT x={188} y={474} />

        {/* -----------------------------------------------
            Bottom breaker
        ------------------------------------------------ */}

        <CircuitBreaker x={188} y={595} />

        <Motor x={220} y={617} />

        <MotorSpecification x={70} y={592} />

      </Layer>
    </Stage>
  );
};

export default Protection2;
