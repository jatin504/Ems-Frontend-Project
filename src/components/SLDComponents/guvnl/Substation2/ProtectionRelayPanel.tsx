import React from "react";
import { Group, Rect } from "react-konva";

import Label from "./Label";
import Annunciator from "./Annunciator";

import BottomRelaySection from "./BottomRelaySection";
import { RelaySection } from "./RelaySection";
import { DifferentialRelay } from "./DifferentialRelay";
import { RED } from "../electrical/constants";


const ProtectionRelayPanel: React.FC = () => (
  <Group>
    <Rect
      x={397}
      y={153}
      width={435}
      height={365}
      stroke={RED}
      strokeWidth={2}
    />

    <Rect
      x={484}
      y={135}
      width={148}
      height={20}
      stroke={RED}
      strokeWidth={2}
      fill="#fff"
    />

    <Label
      x={490}
      y={140}
      text="TRANSFORMER BAY CRP"
      fontSize={9}
    />

    <Label
      x={610}
      y={158}
      text="20Y ANNUNCIATOR"
      fontSize={7}
    />

    <Annunciator />

    <RelaySection />

    <DifferentialRelay />

    <BottomRelaySection />
  </Group>
);

export default ProtectionRelayPanel;
