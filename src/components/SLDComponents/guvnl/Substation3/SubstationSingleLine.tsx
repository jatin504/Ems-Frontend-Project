import React from "react";
import { Line, Group, Arrow } from "react-konva";

import {BusIsolator} from "./BusIsolator";
import { BLACK, RED, FONT_SIZE } from "../electrical/constants";
import { Txt } from "../Substation1/Txt";
import { BLUE } from "./ElectricalSymbol";
import Breaker52 from "../PCSFeeder/Breaker52";
import ProtectionTable from "../PCSFeeder/ProtectionTable";
import { MeterCard } from "../PCSFeeder/MeterCard";
import MeasurementBranch from "../Substation2/MeasurementBranch";
import Annunciator from "./Annunciator";

export default function SubstationSingleLine({lineNumber=1} : {lineNumber : number}) {
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
          785,
        ]}
        stroke={RED}
        strokeWidth={3}
      />

      {/* Arrow */}
      <Arrow
        points={[mainX, 50, mainX, -20]}
        stroke={"#248e30"}
        fill={"#248e30"}
        strokeWidth={3}
        pointerLength={75}
        pointerWidth={75}
      />

      <Txt
        x={mainX - 40}
        y={-70}
        text={"LINE-" + lineNumber}
        fontSize={FONT_SIZE}
        fill={BLUE}
        bold
      />


      {/* ================================================= */}
      {/* BUS ISOLATOR */}
      {/* ================================================= */}

      <BusIsolator x={mainX} y={100} connected />

      <Txt
        x={20}
        y={110}
        text="BUS ISOLATOR / ES"
        fontSize={FONT_SIZE}
        fill={BLUE}
        bold
      />

      <Annunciator
        x={500}
        y={100}
        scale={2.2}
      />

      <MeasurementBranch
        x={410}
        y={150}
        scale={3}
      />

      {/* Meter data */}
      <MeterCard
        x={640}
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


      {/* ================================================= */}
      {/* CIRCUIT BREAKER */}
      {/* ================================================= */}

      <Txt
        x={20}
        y={610}
        text="BUS ISOLATOR / ES"
        fontSize={FONT_SIZE}
        fill={BLUE}
        bold
      />

      <Breaker52
        x={mainX}
        y={630}
        scale={3}
      />

      <ProtectionTable
        x={470}
        y={520}
      />
    </Group>
  );
}
