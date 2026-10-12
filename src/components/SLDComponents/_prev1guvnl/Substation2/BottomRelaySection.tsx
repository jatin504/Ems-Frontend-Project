import React from "react";
import { Group } from "react-konva";
import RelayCircle from "./RelayCircle";

const BottomRelaySection: React.FC = () => (
  <Group>
    <RelayCircle
      x={607}
      y={467}
      text="86"
      radius={13}
    />

    <RelayCircle
      x={637}
      y={467}
      text="95-1"
      radius={13}
    />

    <RelayCircle
      x={670}
      y={467}
      text="95-2"
      radius={13}
    />

    <RelayCircle
      x={637}
      y={496}
      text="80A"
      radius={13}
    />

    <RelayCircle
      x={669}
      y={496}
      text="80B"
      radius={13}
    />
  </Group>
);

export default BottomRelaySection;
