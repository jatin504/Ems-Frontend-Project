import React from "react";
import { Stage, Layer, Rect, Group } from "react-konva";

import type { Substation2Props } from "./types";

import RedLine from "./RedLine";
import { MeterCard } from "../PCSFeeder/MeterCard";
import MeasurementBranch from "./MeasurementBranch";
import Breaker52 from "../PCSFeeder/Breaker52";
import ProtectionTable from "../PCSFeeder/ProtectionTable";
import Annunciator from "./Annunciator";
import { BLUE, FONT_SIZE } from "../electrical/constants";
import { Txt } from "../Substation1/Txt";

export default function Substation2({
}: Substation2Props) {
  return (
    <Group>

      <Annunciator 
        x={550}
        y={10}
        scale={2.2}
      />

      <Txt
        x={-100}
        y={131}
        text="BUS ISOLATOR / ES"
        fontSize={FONT_SIZE}
        fill={BLUE}
        bold
      />

      <Breaker52
        x={295}
        y={130}
        scale={3}
      />

      <ProtectionTable
        x={370}
        y={20}
      />

      <MeasurementBranch
        x={292}
        y={150}
        scale={3}
      />

      {/* Meter data */}
      <MeterCard
        x={540}
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
     

      {/* Bottom continuation */}
      <RedLine
        points={[293, 0, 293, 565]}
        strokeWidth={3}
      />
    </Group>
  );
}
