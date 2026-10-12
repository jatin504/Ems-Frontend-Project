import React from "react";
import {
  Group,
  Rect,
  Text,
  Circle,
} from "react-konva";

import Wire from "./Wire";
import Breaker52 from "./Breaker52";
import MotorSymbol from "./MotorSymbol";
import ProtectionCircle from "./ProtectionCircle";
import Annunciator from "./Annunciator";
import CTBranch from "./CTBranch";
import ProtectionTable from "./ProtectionTable";
import MeasurementBranch from "./MeasurementBranch";
import Differential87T from "./Differential87T";

import {
  ORANGE,
  BLUE,
  BLACK,
} from "../electrical/constants";
import { VCBStatusCard } from "./VCBCard";
import { MeterCard } from "./MeterCard";

interface PCSFeederProps {
  x?: number;
  y?: number;
}




/* =========================================================
   PCS FEEDER
   ========================================================= */

const PCSFeeder: React.FC<PCSFeederProps> = ({
  x = 0,
  y = 0,
}) => {
  return (
    <Group x={x} y={y}>

      {/* =================================================
          MAIN CONTROL LINE
          ================================================= */}

      <Wire
        points={[
          33,
          0,
          33,
          710,
        ]}
        width={2}
      />

      {/* =================================================
          52 BREAKER
          ================================================= */}


      {/* VCB STATUS */}
      {/* <VCBStatusCard
        x={-200}
        y={0}
        width={220}
        height={150}
      /> */}

      {/* =================================================
          M / 94 / 95 / 86
          ================================================= */}

      

        <Group
          scaleX={3} scaleY={3}
          x={-67}
          y={0}
        >
          <Breaker52
            x={33}
            y={120}
            scale={1}
          />
        </Group>

        <ProtectionTable 
          x={141}
          y={250}
        />

      {/* =================================================
          ANNUNCIATOR
          ================================================= */}

      <Annunciator
        x={55}
        y={20}
        scale={2.2}
      />

      {/* =================================================
          METER 1
          ================================================= */}

      <MeterCard
        x={480}
        y={400}
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

      {/* =================================================
          MFM / BUS PT
          ================================================= */}

      <MeasurementBranch
        x={33}
        y={380}
        scale={3}
      />

      {/* =================================================
          87T
          ================================================= */}

      {/* <Differential87T
        x={33}
        y={460}
        scale={3}
      /> */}

    </Group>
  );
};

export default PCSFeeder;
