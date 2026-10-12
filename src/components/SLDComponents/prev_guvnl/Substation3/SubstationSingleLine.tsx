import React from "react";
import { Stage, Layer, Line, Group } from "react-konva";

import Cable from "./Cable";
import LightningArrester from "./LightningArrester";
import MPT from "./MPT";
import LineIsolator from "./LineIsolator";
import CT from "./CT";
import CircuitBreaker from "./CircuitBreaker";
import BusIsolator from "./BusIsolator";
import ProtectionPanel from "./ProtectionPanel";
import { RED } from "../electrical/constants";

export default function SubstationSingleLine() {
  const mainX = 408;

  return (
    <Group>
      {/* ================================================= */}
      {/* MAIN VERTICAL FEEDER */}
      {/* ================================================= */}

      <Line
        points={[
          mainX,
          25,
          mainX,
          775,
        ]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* ================================================= */}
      {/* CABLE */}
      {/* ================================================= */}

      <Cable
        x={mainX}
        y={25}
        height={45}
      />

      {/* ================================================= */}
      {/* LIGHTNING ARRESTER */}
      {/* ================================================= */}

      <LightningArrester
        x={mainX}
        y={98}
      />

      {/* ================================================= */}
      {/* MPT */}
      {/* ================================================= */}

      <MPT
        x={mainX}
        y={145}
      />

      {/* ================================================= */}
      {/* LINE ISOLATOR */}
      {/* ================================================= */}

      <LineIsolator
        x={mainX}
        y={215}
      />

      {/* ================================================= */}
      {/* CT */}
      {/* ================================================= */}

      <CT
        x={mainX}
        y={335}
        cores={[
          {
            name: "CORE 1",
            className: "CLASS 5P20",
            rating: "20VA",
          },
          {
            name: "CORE 2",
            className: "CLASS 5P20",
            rating: "20VA",
            spare: true,
          },
          {
            name: "CORE 3",
            className: "CLASS 0.2S",
            rating: "20VA",
          },
          {
            name: "CORE 4",
            className: "CLASS 0.2S",
            rating: "20VA",
            spare: true,
          },
        ]}
      />

      {/* ================================================= */}
      {/* CIRCUIT BREAKER */}
      {/* ================================================= */}

      <CircuitBreaker
        x={mainX}
        y={610}
      />

      {/* ================================================= */}
      {/* BUS ISOLATOR */}
      {/* ================================================= */}

      <BusIsolator
        x={mainX}
        y={725}
      />

      {/* ================================================= */}
      {/* PROTECTION PANEL */}
      {/* ================================================= */}

      <ProtectionPanel
        x={520}
        y={295}
        width={430}
        height={300}
      />
    </Group>
  );
}
