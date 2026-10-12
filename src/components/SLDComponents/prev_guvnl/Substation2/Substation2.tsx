import React from "react";
import { Stage, Layer, Rect, Group } from "react-konva";

import type { Substation2Props } from "./types";

import RedLine from "./RedLine";
import {EquipmentInformation} from "./EquipmentInformation";
import BayTitle from "./BayTitle";
import {IncomingBay} from "./IncomingBay";
import {CTSection} from "./CTSection";
import ProtectionRelayPanel from "./ProtectionRelayPanel";
import VTSection from "./VTSection";

export default function Substation2({
  width = 865,
  height = 565,
  scale = 1,
}: Substation2Props) {
  return (
    <Group>
      {/* White background */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#ffffff"
      />

      {/* Top horizontal reference line */}
      <RedLine
        points={[0, 0, width, 0]}
        strokeWidth={1}
      />

      {/* Left equipment specifications */}
      <EquipmentInformation />

      {/* Main bay title */}
      <BayTitle />

      {/* Incoming 66kV bay equipment */}
      <IncomingBay />

      {/* CT / VT equipment */}
      <CTSection />

      {/* Transformer control/protection panel */}
      <ProtectionRelayPanel />

      {/* VT labels / connections */}
      <VTSection />

      {/* Transformer/bay feeder continuation */}
      <RedLine
        points={[397, 518, 832, 518]}
        strokeWidth={2}
      />

      {/* Bottom continuation */}
      <RedLine
        points={[293, 532, 293, 565]}
        strokeWidth={3}
      />
    </Group>
  );
}
