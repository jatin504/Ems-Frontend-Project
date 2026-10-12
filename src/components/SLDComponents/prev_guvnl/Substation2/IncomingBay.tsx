import React from "react";
import { Group, Ellipse } from "react-konva";

import RedLine from "./RedLine";
import Label from "./Label";
import VerticalConductor from "./VerticalConductor";
import ConnectionPoint from "./ConnectionPoint";
import DisconnectSwitch from "./DisconnectSwitch";
import MotorIsolator from "./MotorIsolator";
import Breaker from "./Breaker";
import EquipmentBox from "./EquipmentBox";
import RelayCircle from "./RelayCircle";
import { RED } from "../electrical/constants";


export const IncomingBay: React.FC = () => (
  <Group>
    {/* Top bus */}
    <Ellipse
      x={293}
      y={18}
      radiusX={31}
      radiusY={10}
      stroke={RED}
      strokeWidth={2}
    />

    <RedLine points={[293, 0, 293, 54]} strokeWidth={2} />

    {/* vertical feeder */}
    <VerticalConductor x={293} y1={54} y2={565} />

    {/* Motorized isolator */}
    <MotorIsolator x={293} y={72} />

    {/* side branch */}
    <RedLine points={[304, 72, 380, 72, 380, 106]} />

    <RelayCircle x={405} y={106} text="E/I" radius={12} />

    {/* Isolator */}
    <DisconnectSwitch x={293} y={107} />

    {/* Breaker */}
    <Breaker x={293} y={139} />

    <EquipmentBox
      x={317}
      y={134}
      width={23}
      height={10}
    />

    <ConnectionPoint x={293} y={212} />

    <Label x={303} y={204} text="P1" fontSize={13} />

    {/* Second point */}
    <ConnectionPoint x={293} y={472} />

    <Label x={303} y={463} text="P2" fontSize={13} />

    {/* Lightning arrester */}
    <EquipmentBox
      x={306}
      y={517}
      width={20}
      height={10}
    />

    <RedLine points={[293, 517, 306, 517]} />
    <RedLine points={[326, 517, 340, 517]} />
  </Group>
);
