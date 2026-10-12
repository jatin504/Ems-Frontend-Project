import React from "react";
import {
  Group,
  Text,
} from "react-konva";

import VerticalBus from "./VerticalBus";
import SurgeArrester from "./SurgeArrester";
import BlueText from "./BlueText";
import EquipmentSymbol from "./EquipmentSymbol";
import Annunciator from "./Annunciator";
import LinePT from "./LinePT";
import Transformer from "./Transformer";
import ProtectionFunctions from "./ProtectionFunctions";
import CT from "./CT";
import RelayBlock from "./RelayBlock";
import CTSpecification from "./CTSpecification";
import MultifunctionMeter from "./MultifunctionMeter";
import Wire from "./Wire";
import SpareCT from "./SpareCT";
import CircuitBreaker from "./CircuitBreaker";
import Motor from "./Motor";
import MotorSpecification from "./MotorSpecification";
import ProtectionTable from "../PCSFeeder/ProtectionTable";
import { MeterCard } from "../PCSFeeder/MeterCard";
import MeasurementBranch from "../PCSFeeder/MeasurementBranch";
import DataValueTable from "../PCSBlock/DataValueTable";
import Breaker52 from "../PCSFeeder/Breaker52";

interface ICOGProps {
  x?: number;
  y?: number;
}

const ICOG: React.FC<ICOGProps> = ({
  x = 0,
  y = 0,
}) => {
  const BUS_X = 188;

  return (
    <Group
      x={x}
      y={y}
    >

      {/* =========================
          Main vertical conductor
          ========================= */}

      <Group
        y={-200}
      >
        <VerticalBus
          x={BUS_X}
          height={875}
        />
      </Group>

      {/* =========================
          TOP SECTION
          ========================= */}

      {/* <EquipmentSymbol
        x={222}
        y={38}
      /> */}

      <Annunciator
        x={200}
        y={0}
        scale={1.8}
      />

      {/* =========================
          PT
          ========================= */}

      <LinePT
        x={118}
        y={170}
        scale={2}
      />

      {/* =========================
          TRANSFORMER
          ========================= */}

      <Transformer
        x={287}
        y={185}
      />

      <DataValueTable
        x={400}
        y={145}
        title=""
        width={150}
        value={{
          OTI: "1°C",
          WTI: "23°C",
          // PRD: 45,
          // OLTC: 12,
          // TEMP: 67,
        }}
        scale={1.2}
      />

      {/* Transformer data */}

      {/* =========================
          PROTECTION
          ========================= */}

      {/* <ProtectionFunctions
        x={376}
        y={92}
      /> */}

      {/* Relay data */}

      {/* =========================
          MFM
          ========================= */}

      <MeasurementBranch
        x={188}
        y={150}
        scale={3}
      />

      {/* Meter data */}
      <MeterCard
        x={540}
        y={270}
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

      {/* =========================
          MFM CONNECTION
          ========================= */}

      {/* <Wire
        points={[
          233,
          146,
          310,
          146,
          310,
          280,
          270,
          280,
        ]}
      /> */}

      {/* =========================
          BOTTOM BREAKER
          ========================= */}

      <Breaker52
        x={188}
        y={420}
        scale={3}
      />

      <ProtectionTable 
        x={238}
        y={360}
      />

    </Group>
  );
};

export default ICOG;
