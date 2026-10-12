import React from "react";
import { Group } from "react-konva";
import Label from "./Label";


export const EquipmentInformation: React.FC = () => (
  <Group>
    <Label
      x={85}
      y={0}
      text="SINGLE AL59"
      fontSize={14}
    />

    <Label
      x={85}
      y={16}
      text="PANTHER"
      fontSize={14}
    />

    <Label
      x={50}
      y={38}
      text="601-BUS ISO WO ES"
      fontSize={14}
    />

    <Label
      x={50}
      y={57}
      text="66 kV, 1250 A,"
      fontSize={14}
    />

    <Label
      x={50}
      y={76}
      text="31.5 kA FOR 3 SEC"
      fontSize={14}
    />

    <Label
      x={50}
      y={103}
      text="601-CB"
      fontSize={14}
    />

    <Label
      x={50}
      y={122}
      text="72.5 kV, 1600A,"
      fontSize={14}
    />

    <Label
      x={50}
      y={141}
      text="31.5 kA FOR 3 SEC"
      fontSize={14}
    />

    <Label
      x={50}
      y={220}
      text="601-CT - 66 KV, 600/1-1-1-1 A"
      fontSize={14}
    />

    <Label
      x={50}
      y={240}
      text="CORE 1 -CLASS 5P20"
      fontSize={14}
    />

    <Label
      x={50}
      y={259}
      text="20VA"
      fontSize={14}
    />

    <Label
      x={50}
      y={289}
      text="CORE 2 -CLASS PS,"
      fontSize={14}
    />

    <Label
      x={50}
      y={308}
      text="Vk ~ V, Im - 30mA@Vk/2"
      fontSize={14}
    />

    <Label
      x={50}
      y={328}
      text="CORE 3 -CLASS PS,"
      fontSize={14}
    />

    <Label
      x={50}
      y={347}
      text="Vk ~ V, Im - 30mA@Vk/2"
      fontSize={14}
    />

    <Label
      x={50}
      y={386}
      text="CORE 4 -CLASS 0.2s, 20VA"
      fontSize={14}
    />

    <Label
      x={50}
      y={454}
      text="601-LA"
      fontSize={14}
    />

    <Label
      x={50}
      y={474}
      text="60 kV, 10 kA STATION CLASS III"
      fontSize={14}
    />
  </Group>
);
