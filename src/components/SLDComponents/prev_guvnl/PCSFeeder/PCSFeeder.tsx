import React from "react";
import {
  Group,
  Text,
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

import { ORANGE, RED } from "../electrical/constants";

interface PCSFeederProps {
  x?: number;
  y?: number;
}

const PCSFeeder: React.FC<PCSFeederProps> = ({
  x = 0,
  y = 0,
}) => {
  return (
    <Group
      x={x}
      y={y}
    >

      {/* Main control line */}

      <Wire
        points={[
          33,
          0,
          33,
          800,
        ]}
        width={1.2}
      />

      {/* 52 */}

      <Breaker52
        x={33}
        y={255}
      />

      {/* Breaker data */}

      <Group
        y={-40}
      >
        <Text
          x={55}
          y={238}
          text="52"
          fontSize={12}
          fill={ORANGE}
        />

        <Text
          x={55}
          y={253}
          text="CLOSED"
          fontSize={11}
          fill={ORANGE}
        />

        <Text
          x={55}
          y={268}
          text="500 A"
          fontSize={11}
          fill={ORANGE}
        />
      </Group>


      {/* M / 94 / 95 / 86 */}

      <Wire
        points={[
          42,
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

      {/* Annunciator */}

      <Annunciator
        x={145}
        y={32}
      />

      {/* 50 / 51 */}

      <CTBranch
        x={33}
        y={300}
      />

      <ProtectionTable
        x={100}
        y={322}
      />

      {/* Meter data */}

      <Group
        x={80}
        y={20}
      >
        <Text
          x={150}
          y={300}
          text="500 kW"
          fontSize={12}
          fill={ORANGE}
        />

        <Text
          x={150}
          y={316}
          text="100 kVAR"
          fontSize={12}
          fill={ORANGE}
        />

        <Text
          x={150}
          y={332}
          text="50 Hz"
          fontSize={12}
          fill={ORANGE}
        />
      </Group>


      {/* MFM / BUS PT */}

      <MeasurementBranch
        x={33}
        y={390}
      />

      {/* Meter data */}

      <Group
        x={50}
        y={35}
      >
        <Text
          x={100}
          y={385}
          text="500 kW"
          fontSize={12}
          fill={ORANGE}
        />

        <Text
          x={100}
          y={401}
          text="100 kVAR"
          fontSize={12}
          fill={ORANGE}
        />

        <Text
          x={100}
          y={417}
          text="50 Hz"
          fontSize={12}
          fill={ORANGE}
        />
      </Group>


      {/* 87T */}

      <Differential87T
        x={33}
        y={500}
      />

    </Group>
  );
};

export default PCSFeeder;
