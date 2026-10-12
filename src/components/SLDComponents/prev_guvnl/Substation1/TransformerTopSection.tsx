import { Group, Ellipse, Line } from "react-konva";

import { Wire } from "./Wire";
import { Txt } from "./Txt";
import { PowerTransformer } from "./PowerTransformer";
import { TransformerCTPanel } from "./TransformerCTPanel";
import { BLUE, RED } from "../electrical/constants";


export const TransformerTopSection = ({ mainX }: { mainX: number }) => {
  return (
    <Group>
      {/* ------------------------------------------------------------------ */}
      {/* Transformer                                                         */}
      {/* ------------------------------------------------------------------ */}

      <PowerTransformer x={mainX} y={190} />

      {/* Transformer title */}
      <Txt
        x={116}
        y={151}
        text="POWER TRANSFORMER - 1"
        fontSize={14}
        fill={BLUE}
        bold
      />

      <Txt
        x={116}
        y={171}
        text="62.5 MVA, 66/33 kV, YNyn0"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={116}
        y={190}
        text="ONAN, ONAF, %Z=11,"
        fontSize={14}
        fill={BLUE}
      />

      <Txt
        x={116}
        y={209}
        text="RANGE=±10@1.25%"
        fontSize={14}
        fill={BLUE}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Upper transformer CT panel                                         */}
      {/* ------------------------------------------------------------------ */}

      <TransformerCTPanel
        x={426}
        y={82}
        title="PROTECTION FOR HV"
        core1={"CORE 1\n60/1A\nCLASS PS"}
        core2={"CORE 2\n60/1A\nCLASS 5P20"}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Lower transformer CT panel                                         */}
      {/* ------------------------------------------------------------------ */}

      <TransformerCTPanel
        x={426}
        y={246}
        title="PROTECTION FOR LV"
        core1={"CORE 1\n1200/1A\nCLASS PS"}
        core2={"CORE 2\n1200/1A\nCLASS 5P20"}
      />

      {/* Main horizontal CT leads */}
      <Wire points={[mainX + 30, 174, 426, 174]} strokeWidth={2} />
      <Wire points={[mainX + 30, 246, 426, 246]} strokeWidth={2} />

      {/* ------------------------------------------------------------------ */}
      {/* Twin AL59 Panther conductor                                        */}
      {/* ------------------------------------------------------------------ */}

      <Txt
        x={116}
        y={294}
        text="TWIN AL59 PANTHER"
        fontSize={14}
        fill={BLUE}
        bold
      />

      <Txt
        x={116}
        y={312}
        text="CONDUCTOR"
        fontSize={14}
        fill={BLUE}
        bold
      />

      {/* Twin horizontal conductor */}
      <Wire
        points={[116, 331, mainX - 25, 331]}
        strokeWidth={3}
      />

      <Wire
        points={[116, 337, mainX - 25, 337]}
        strokeWidth={3}
      />

      {/* Crossing / conductor loop */}
      <Ellipse
        x={mainX}
        y={334}
        radiusX={31}
        radiusY={8}
        stroke={RED}
        strokeWidth={2}
        fill="#fff"
      />

      <Wire
        points={[mainX - 31, 334, mainX + 31, 334]}
        strokeWidth={2}
      />

      {/* Main vertical feeder */}
      <Wire
        points={[mainX, 265, mainX, 399]}
        strokeWidth={3}
      />

       {/* ------------------------------------------------------------------ */}
       {/* 301-LA                                                               */}
       {/* ------------------------------------------------------------------ */}

      <Txt
        x={116}
        y={393}
        text="301-LA"
        fontSize={14}
        fill={BLUE}
        bold
      />

      <Txt
        x={116}
        y={413}
        text="30 kV, 10 kA STATION CLASS III"
        fontSize={14}
        fill={BLUE}
      />

      {/* LA symbol */}
      <Group>
        <Wire points={[mainX, 384, mainX, 404]} strokeWidth={3} />

        <Line
          points={[mainX - 8, 404, mainX + 8, 404]}
          stroke={RED}
          strokeWidth={2}
        />

        <Line
          points={[mainX - 7, 411, mainX + 7, 411]}
          stroke={RED}
          strokeWidth={2}
        />

        <Line
          points={[mainX - 6, 418, mainX + 6, 418]}
          stroke={RED}
          strokeWidth={2}
        />

        <Wire
          points={[mainX, 418, mainX, 440]}
          strokeWidth={2}
        />

        {/* earth */}
        <Wire
          points={[mainX - 12, 440, mainX + 12, 440]}
          strokeWidth={2}
        />

        <Wire
          points={[mainX - 8, 445, mainX + 8, 445]}
          strokeWidth={2}
        />

        <Wire
          points={[mainX - 4, 450, mainX + 4, 450]}
          strokeWidth={2}
        />
      </Group>

      {/* Continue main conductor */}
      <Wire
        points={[mainX, 399, mainX, 500]}
        strokeWidth={3}
      />
    </Group>
  );
};
