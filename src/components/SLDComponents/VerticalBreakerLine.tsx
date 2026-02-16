// src/components/VerticalBreakerLine.tsx
import React, { useState } from "react";
import { Group, Line, Rect, Circle, Text } from "react-konva";
import { useSSE } from "../../hooks/sse/useSSE";

interface VerticalBreakerLineType {
  topic : string;
  data : any;
  dataPOI : any;
  textColor?: string;
}


const VerticalBreakerLine: React.FC<VerticalBreakerLineType> = ({topic, data, dataPOI, textColor = "white"}) => {
  // Breaker 1 (draggable)
  const [position1, setPosition1] = useState({ x: 231, y: 201 });
  const lineHeight1 = 240;
  const rectWidth = 14;
  const rectHeight = 30;
  const rectY1 = lineHeight1 - rectHeight - 40;
  const dotY1 = 70;

  // Breaker 2 (fixed)
  const fixedX2 = 923;
  const fixedY2 = 334;
  const lineHeight2 = 100;
  const rectHeight2 = 28;
  const rectY2 = lineHeight2 / 2 - rectHeight2 / 2;

  // Breaker 3 (fixed)
  const fixedX3 = 233;
  const fixedY3 = 40;
  const lineHeight3 = 120;
  const crossY = 50;
  const dotY3 = 80;

  // Breaker 4 — Fixed at x=234, y=-81
  const fixedX4 = 234;
  const fixedY4 = -81;

  const [dataMap, setDataMap] = useState<Record<string, any>>({});

  const topics = [
      "plant_1_pcs_pcs_1",
      "plant_1_poi_meter_1",
      "plant_1_poi_meter_2",
      "plant_1_poi_meter_3",
      "plant_1_poi_meter_4",
      "plant_1_poi_meter_5",
      "plant_1_poi_meter_6",
      "plant_1_poi_meter_7",
      "plant_1_poi_meter_8",
      "plant_1_poi_meter_9",
      "plant_1_poi_meter_10",
    ]

  // useSSE({
  //   url: `http://localhost:5179/stream?topics=${[
  //     "plant_1_pcs_pcs_2",
  //     "plant_1_poi_meter_1"
  //   ].join(",")}`,
  //   onMessage: ({ topic, message }) => {
  //     setDataMap((prev) => ({ ...prev, [topic]: message }));
  //   },
  //   onError: (err) => console.error("SSE error:", err),
  // });

  // const data = dataMap["plant_1_pcs_pcs_2"];
  // const dataPOI = dataMap["plant_1_poi_meter_1"];


  // const dataPOI2 = dataMap["plant_1_poi_meter_2"];
  // const dataPOI3 = dataMap["plant_1_poi_meter_3"];
  // const dataPOI4 = dataMap["plant_1_poi_meter_4"];
  // const dataPOI5 = dataMap["plant_1_poi_meter_5"];
  // const dataPOI6 = dataMap["plant_1_poi_meter_6"];
  // const dataPOI7 = dataMap["plant_1_poi_meter_7"];
  // const dataPOI8 = dataMap["plant_1_poi_meter_8"];
  // const dataPOI9 = dataMap["plant_1_poi_meter_9"];
  // const dataPOI10 = dataMap["plant_1_poi_meter_10"];
  // etc.



  return (
    <>
      {/* Breaker 1 — Draggable */}
      <Group
        x={position1.x}
        y={position1.y}
        draggable = {false}
        onDragEnd={(e) => {
          const newX = Math.round(e.target.x());
          const newY = Math.round(e.target.y());
          setPosition1({ x: newX, y: newY });
          console.log("Breaker 1 dragged to:", { x: newX, y: newY });
        }}
      >
        <Line points={[0, 0, 0, lineHeight1]} stroke="red" strokeWidth={1.5} />
        <Line points={[-8, 15, 8, 30]} stroke="red" strokeWidth={2} />
        <Line points={[8, 15, -8, 30]} stroke="red" strokeWidth={2} />
        <Circle x={0} y={dotY1} radius={4} fill="red" />
        <Rect
          x={-rectWidth / 2}
          y={rectY1}
          width={rectWidth}
          height={rectHeight}
          stroke="red"
          strokeWidth={2}
        />
        <Text
          x={rectWidth / 2 + 5}
          y={rectY1 + rectHeight - 20}
          text="F01"
          fontSize={14}
          fill={textColor}
        />
        <Text x={10} y={dotY1 - 8} text="QA1" fontSize={14} fill={textColor} />
        <Text x={-100} y={dotY1 - 20} text={ "200.00A"} fontSize={14} fill="orange" />
        <Text x={-100} y={dotY1} text="645.10V" fontSize={14} fill="orange" />
        <Text x={-100} y={dotY1 + 20} text="1.3MV" fontSize={14} fill="orange" />
      </Group>

      {/* Breaker 2 — Fixed */}
      <Group x={fixedX2} y={fixedY2}>
        <Line points={[0, 0, 0, lineHeight2]} stroke="red" strokeWidth={1.5} />
        <Rect
          x={-rectWidth / 2}
          y={rectY2}
          width={rectWidth}
          height={rectHeight2}
          stroke="red"
          strokeWidth={2}
        />
        <Text
          x={rectWidth / 2 + 5}
          y={rectY2 + rectHeight2 / 2 - 8}
          text="F02"
          fontSize={14}
          fill={textColor}
        />
      </Group>

       <Group x={fixedX3} y={fixedY3}>
        <Line points={[0, -50, 0, lineHeight3]} stroke="red" strokeWidth={1.5} />
        <Line points={[-6, crossY, 6, crossY + 12]} stroke="red" strokeWidth={2} />
        <Line points={[6, crossY, -6, crossY + 12]} stroke="red" strokeWidth={2} />
        <Circle x={0} y={dotY3} radius={4} fill="red" />
        <Text x={10} y={dotY3 - 10} text="QA1" fontSize={14} fill={textColor} />
        <Text x={-100} y={dotY3 - 30} text={(data? data.BCU_1_Energy_charged_this_month? data.BCU_1_Energy_charged_this_month.value : 0 : 0) + " A"} fontSize={14} fill="orange" />
        <Text x={-100} y={dotY3 - 10} text={(data? data.BCU_1_Rack_voltage? data.BCU_1_Rack_voltage.value : 0 : 0) + " V"} fontSize={14} fill="orange" />
        <Text x={-100} y={dotY3 + 10} text={(data? data.Power_factor? data.Power_factor.value : 0 : 0) + " Hz"} fontSize={14} fill="orange" />
        <Text x={-100} y={dotY3 + 30} text={(data? data.Active_power? data.Active_power.value : 0 : 0) + " kVAr"} fontSize={14} fill="orange" />

        <Text x={10} y={-30} text="TRA01" fontSize={14} fill={textColor} />
      </Group>

      {/* Breaker 4 — Fixed green vertical line with top arrow + right labels */}
      <Group x={fixedX4} y={fixedY4}>
        <Line points={[0, 0, 0, 40]} stroke="green" strokeWidth={2} />
        <Line
          points={[
            0, -10,
            -6, 0,
            6, 0,
            0, -10
          ]}
          closed
          fill="green"
        />
        <Text x={70} y={0} text={(dataPOI? dataPOI.BCU_1_Rack_voltage? dataPOI.BCU_1_Rack_voltage.value : 0 : 0) + " V"} fontSize={14} fill="orange" />
        <Text x={70} y={20} text={(dataPOI? dataPOI.Active_power? dataPOI.Active_power.value : 0 : 0) + " Hz"} fontSize={14} fill="orange" />
        <Text x={70} y={40} text={(dataPOI? dataPOI.Power_factor? dataPOI.Power_factor.value : 0 : 0) + " kW"} fontSize={14} fill="orange" />
        <Text x={70} y={60} text={(dataPOI? dataPOI.Quantity_of_rectifiers? dataPOI.Quantity_of_rectifiers.value : 0 : 0) + " A"} fontSize={14} fill="orange" />
        <Text x={70} y={80} text={(dataPOI? dataPOI.BCU_1_Charge_Discharge_power? dataPOI.BCU_1_Charge_Discharge_power.value : 0 : 0) + " kWh"} fontSize={14} fill="orange" />
        <Text x={70} y={100} text={(dataPOI? dataPOI.BCU_1_DOD? dataPOI.BCU_1_DOD.value : 0 : 0) + " kWh"} fontSize={14} fill="orange" />
{/* 
        <Text x={150} y={0} text={(dataPOI2? dataPOI2.voltage? dataPOI2.voltage.value : 0 : 0) + " V"} fontSize={14} fill="red" />
        <Text x={150} y={20} text={(dataPOI2? dataPOI2.frequency? dataPOI2.frequency.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={150} y={40} text={(dataPOI2? dataPOI2.power? dataPOI2.power.value : 0 : 0) + " kW"} fontSize={14} fill="green" />
        <Text x={150} y={60} text={(dataPOI2? dataPOI2.current? dataPOI2.current.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={150} y={80} text={(dataPOI2? dataPOI2.energy? dataPOI2.energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={150} y={100} text={(dataPOI2? dataPOI2.total_energy? dataPOI2.total_energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />

        <Text x={230} y={0} text={(dataPOI3? dataPOI3.voltage? dataPOI3.voltage.value : 0 : 0) + " V"} fontSize={14} fill="red" />
        <Text x={230} y={20} text={(dataPOI3? dataPOI3.frequency? dataPOI3.frequency.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={230} y={40} text={(dataPOI3? dataPOI3.power? dataPOI3.power.value : 0 : 0) + " kW"} fontSize={14} fill="green" />
        <Text x={230} y={60} text={(dataPOI3? dataPOI3.current? dataPOI3.current.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={230} y={80} text={(dataPOI3? dataPOI3.energy? dataPOI3.energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={230} y={100} text={(dataPOI3? dataPOI3.total_energy? dataPOI3.total_energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />

        <Text x={310} y={0} text={(dataPOI4? dataPOI4.voltage? dataPOI4.voltage.value : 0 : 0) + " V"} fontSize={14} fill="red" />
        <Text x={310} y={20} text={(dataPOI4? dataPOI4.frequency? dataPOI4.frequency.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={310} y={40} text={(dataPOI4? dataPOI4.power? dataPOI4.power.value : 0 : 0) + " kW"} fontSize={14} fill="green" />
        <Text x={310} y={60} text={(dataPOI4? dataPOI4.current? dataPOI4.current.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={310} y={80} text={(dataPOI4? dataPOI4.energy? dataPOI4.energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={310} y={100} text={(dataPOI4? dataPOI4.total_energy? dataPOI4.total_energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />

        <Text x={390} y={0} text={(dataPOI5? dataPOI5.voltage? dataPOI5.voltage.value : 0 : 0) + " V"} fontSize={14} fill="red" />
        <Text x={390} y={20} text={(dataPOI5? dataPOI5.frequency? dataPOI5.frequency.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={390} y={40} text={(dataPOI5? dataPOI5.power? dataPOI5.power.value : 0 : 0) + " kW"} fontSize={14} fill="green" />
        <Text x={390} y={60} text={(dataPOI5? dataPOI5.current? dataPOI5.current.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={390} y={80} text={(dataPOI5? dataPOI5.energy? dataPOI5.energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={390} y={100} text={(dataPOI5? dataPOI5.total_energy? dataPOI5.total_energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />

        <Text x={470} y={0} text={(dataPOI6? dataPOI6.voltage? dataPOI6.voltage.value : 0 : 0) + " V"} fontSize={14} fill="red" />
        <Text x={470} y={20} text={(dataPOI6? dataPOI6.frequency? dataPOI6.frequency.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={470} y={40} text={(dataPOI6? dataPOI6.power? dataPOI6.power.value : 0 : 0) + " kW"} fontSize={14} fill="green" />
        <Text x={470} y={60} text={(dataPOI6? dataPOI6.current? dataPOI6.current.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={470} y={80} text={(dataPOI6? dataPOI6.energy? dataPOI6.energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={470} y={100} text={(dataPOI6? dataPOI6.total_energy? dataPOI6.total_energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />

        <Text x={550} y={0} text={(dataPOI7? dataPOI7.voltage? dataPOI7.voltage.value : 0 : 0) + " V"} fontSize={14} fill="red" />
        <Text x={550} y={20} text={(dataPOI7? dataPOI7.frequency? dataPOI7.frequency.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={550} y={40} text={(dataPOI7? dataPOI7.power? dataPOI7.power.value : 0 : 0) + " kW"} fontSize={14} fill="green" />
        <Text x={550} y={60} text={(dataPOI7? dataPOI7.current? dataPOI7.current.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={550} y={80} text={(dataPOI7? dataPOI7.energy? dataPOI7.energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={550} y={100} text={(dataPOI7? dataPOI7.total_energy? dataPOI7.total_energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />

        <Text x={630} y={0} text={(dataPOI8? dataPOI8.voltage? dataPOI8.voltage.value : 0 : 0) + " V"} fontSize={14} fill="red" />
        <Text x={630} y={20} text={(dataPOI8? dataPOI8.frequency? dataPOI8.frequency.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={630} y={40} text={(dataPOI8? dataPOI8.power? dataPOI8.power.value : 0 : 0) + " kW"} fontSize={14} fill="green" />
        <Text x={630} y={60} text={(dataPOI8? dataPOI8.current? dataPOI8.current.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={630} y={80} text={(dataPOI8? dataPOI8.energy? dataPOI8.energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={630} y={100} text={(dataPOI8? dataPOI8.total_energy? dataPOI8.total_energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />

        <Text x={710} y={0} text={(dataPOI9? dataPOI9.voltage? dataPOI9.voltage.value : 0 : 0) + " V"} fontSize={14} fill="red" />
        <Text x={710} y={20} text={(dataPOI9? dataPOI9.frequency? dataPOI9.frequency.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={710} y={40} text={(dataPOI9? dataPOI9.power? dataPOI9.power.value : 0 : 0) + " kW"} fontSize={14} fill="green" />
        <Text x={710} y={60} text={(dataPOI9? dataPOI9.current? dataPOI9.current.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={710} y={80} text={(dataPOI9? dataPOI9.energy? dataPOI9.energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={710} y={100} text={(dataPOI9? dataPOI9.total_energy? dataPOI9.total_energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />

        <Text x={790} y={0} text={(dataPOI10? dataPOI10.voltage? dataPOI10.voltage.value : 0 : 0) + " V"} fontSize={14} fill="red" />
        <Text x={790} y={20} text={(dataPOI10? dataPOI10.frequency? dataPOI10.frequency.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={790} y={40} text={(dataPOI10? dataPOI10.power? dataPOI10.power.value : 0 : 0) + " kW"} fontSize={14} fill="green" />
        <Text x={790} y={60} text={(dataPOI10? dataPOI10.current? dataPOI10.current.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={790} y={80} text={(dataPOI10? dataPOI10.energy? dataPOI10.energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" />
        <Text x={790} y={100} text={(dataPOI10? dataPOI10.total_energy? dataPOI10.total_energy.value : 0 : 0) + " Hz"} fontSize={14} fill="green" /> */}


      </Group>
    </>
  );
};

export default VerticalBreakerLine;
