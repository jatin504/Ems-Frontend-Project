import { Group, Line, Rect, Arrow } from "react-konva";

import { BLACK, BLUE, RED } from "../electrical/constants";
import { Wire } from "./Wire";
import { Dot } from "./Dot";
import { Txt } from "./Txt";

import { BusIsolator } from "./BusIsolator";
import { VCB } from "./VCB";
import { CTAssembly } from "./CTAssembly";
import { LinePT } from "./LinePT";

import { Relay } from "./Relay";
import { RelayPanel } from "./RelayPanel";


export const ExistingSLD = ({ mainX }: { mainX: number }) => {
  return (
    <Group>

      {/* TOP BUS */}

      <BusIsolator x={mainX} y={11} />

      <Wire points={[mainX, 58, mainX, 136]} strokeWidth={3} />

      <Txt
        x={123}
        y={22}
        text="302-BUS ISO WLES"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={42}
        text="33 kV, 1600 A,"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={60}
        text="31.5 kA FOR 3 SEC"
        fontSize={14}
        fill={BLUE}
      />

      {/* 302 VCB */}

      <Txt
        x={123}
        y={108}
        text="302-VCB"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={128}
        text="36 kV, 1600 A,"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={146}
        text="31.5 kA FOR 3 SEC"
        fontSize={14}
        fill={BLUE}
      />

      <VCB x={mainX} y={136} />

      {/* BREAKER DATA */}

      <Txt
        x={mainX + 90}
        y={115}
        text="CLOSED"
        fontSize={12}
        fill="orange"
      />

      <Txt
        x={mainX + 90}
        y={132}
        text="1600 A"
        fontSize={12}
        fill="orange"
      />

      <Txt
        x={mainX + 90}
        y={149}
        text="33 kV"
        fontSize={12}
        fill="orange"
      />

      <Wire
        points={[mainX + 75, 136, mainX + 75, 159]}
        strokeWidth={3}
      />

      <Wire
        points={[mainX + 40, 136, 376, 136]}
        strokeWidth={2}
      />

      {/* RELAY PANEL */}

      <RelayPanel x={377} y={103} />

      {/* RELAY DATA */}

      <Txt
        x={520}
        y={105}
        text="50/51"
        fontSize={12}
        fill="orange"
      />

      <Txt
        x={520}
        y={121}
        text="50N/51N"
        fontSize={12}
        fill="orange"
      />

      <Txt
        x={520}
        y={137}
        text="27/59"
        fontSize={12}
        fill="orange"
      />

      <Txt
        x={520}
        y={153}
        text="STATUS: OK"
        fontSize={12}
        fill="orange"
      />

      {/* MAIN CONDUCTOR */}

      <Wire points={[mainX, 136, mainX, 190]} strokeWidth={3} />

      <Dot x={mainX} y={190} r={4} />

      {/* CT */}

      <Txt
        x={79}
        y={198}
        text="301-CT - 33 kV, 1200/1-1-1 A"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={79}
        y={220}
        text="CORE 1 - 0.2S CLASS"
        fontSize={14}
        fill={BLUE}
      />

      <Txt x={79} y={238} text="20VA" fontSize={14} fill={BLUE} />

      <Txt
        x={79}
        y={270}
        text="CORE 2 - CLASS 5P20"
        fontSize={14}
        fill={BLUE}
      />

      <Txt x={79} y={288} text="20VA" fontSize={14} fill={BLUE} />

      <Txt
        x={79}
        y={320}
        text="CORE 3 - CLASS PS,"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={79}
        y={338}
        text="Vk - V* - Im - 30mA@Vk/2"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={79}
        y={370}
        text="CORE 4 - CLASS PS,"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={79}
        y={388}
        text="Vk - V* - Im -30mA@Vk/2"
        fontSize={14}
        fill={BLUE}
      />

      <CTAssembly x={mainX} y={242} />

      <Wire
        points={[mainX + 10, 242, 402, 242]}
        strokeWidth={1.8}
      />

      <Wire
        points={[mainX + 10, 277, 420, 277]}
        strokeWidth={1.8}
      />

      <Wire
        points={[mainX + 10, 312, 438, 312]}
        strokeWidth={1.8}
      />

      <Relay x={414} y={242} text="50" />
      <Relay x={436} y={242} text="51" />
      <Relay x={458} y={242} text="50N" />
      <Relay x={480} y={242} text="51N" />

      <Relay x={426} y={272} text="27" />
      <Relay x={450} y={272} text="59" />
      <Relay x={474} y={272} text="27" />
      <Relay x={506} y={272} text="59" />

      {/* RELAY MEASUREMENTS */}

      <Group
        x={60}
      >
        <Txt
          x={520}
          y={220}
          text="500 kW"
          fontSize={12}
          fill="orange"
        />

        <Txt
          x={520}
          y={236}
          text="100 kVAR"
          fontSize={12}
          fill="orange"
        />

        <Txt
          x={520}
          y={252}
          text="50 Hz"
          fontSize={12}
          fill="orange"
        />
      </Group>


      {/* CONTINUE FEEDER */}

      <Wire
        points={[mainX, 347, mainX, 445]}
        strokeWidth={3}
      />

      <Dot x={mainX} y={347} r={4} />

      {/* LINE PT */}

      <Txt
        x={123}
        y={423}
        text="304-LINE PT"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={443}
        text="33 kV / 110 V / 110 V"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={461}
        text="√3      √3      √3"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={481}
        text="VF - 1.2"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={499}
        text="CORE 1 CLASS 0.2, 50VA"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={517}
        text="CORE 2 CLASS 3P, 50VA"
        fontSize={14}
        fill={BLUE}
      />

      <LinePT x={mainX} y={447} />

      {/* METER DATA */}

      <Group
        x={100}
      >
        <Txt
          x={mainX + 55}
          y={425}
          text="500 kW"
          fontSize={12}
          fill="orange"
        />

        <Txt
          x={mainX + 55}
          y={442}
          text="100 kVAR"
          fontSize={12}
          fill="orange"
        />

        <Txt
          x={mainX + 55}
          y={459}
          text="50 Hz"
          fontSize={12}
          fill="orange"
        />

        <Txt
          x={mainX + 55}
          y={476}
          text="33 kV"
          fontSize={12}
          fill="orange"
        />
      </Group>


      {/* MAIN FEEDER */}

      <Wire
        points={[mainX, 445, mainX, 585]}
        strokeWidth={3}
      />

      {/* SECOND BUS ISOLATOR */}

      <BusIsolator x={mainX} y={586} />

      <Txt
        x={123}
        y={573}
        text="302-BUS ISO WLES"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={593}
        text="33 kV, 1600 A,"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={123}
        y={611}
        text="31.5 kA FOR 3 SEC"
        fontSize={14}
        fill={BLUE}
      />

      {/* FEEDER AFTER LOWER ISOLATOR */}

      <Wire
        points={[mainX, 634, mainX, 672]}
        strokeWidth={3}
      />

      {/* 301-LA */}

      <Txt
        x={78}
        y={657}
        text="301-LA"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={78}
        y={677}
        text="30 kV, 10 kA STATION CLASS III"
        fontSize={14}
        fill={BLUE}
      />

      {/* LA */}

      <Group>
        <Wire points={[mainX, 654, mainX, 672]} strokeWidth={3} />

        <Line
          points={[mainX - 7, 672, mainX + 7, 672]}
          stroke={RED}
          strokeWidth={2}
        />

        <Line
          points={[mainX - 6, 679, mainX + 6, 679]}
          stroke={RED}
          strokeWidth={2}
        />

        <Line
          points={[mainX - 5, 686, mainX + 5, 686]}
          stroke={RED}
          strokeWidth={2}
        />
      </Group>

      {/* FINAL FEEDER */}

      <Wire
        points={[mainX, 721, mainX, 760]}
        strokeWidth={3}
      />

      <Arrow
        points={[mainX, 752, mainX, 800]}
        stroke={BLACK}
        fill={BLACK}
        strokeWidth={3}
        pointerLength={14}
        pointerWidth={11}
      />

      <Rect
        x={262}
        y={801}
        width={110}
        height={29}
        stroke={BLACK}
        strokeWidth={1}
        fill="#fff"
      />

      <Txt
        x={263}
        y={809}
        text="Cable to Line"
        fontSize={12}
        fill={BLACK}
        width={108}
        align="center"
      />

    </Group>
  );
};
