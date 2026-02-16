import React, { useState } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../../Graphs/ColumnGraph";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const ChargeDischargeChart: React.FC = () => {
  // Light/Dark colors (dark keeps #161B1B)
  const CARD_BG = useColorModeValue("#FFFFFF", "#161B1B");
  const BORDER = useColorModeValue("#E5E7EB", "#202525");
  const TITLE_COLOR = useColorModeValue("#111827", "#E8ECEC");
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");

  const series = [
    {
      name: "Charge kWh",
      type: "column",
      data: [5000, 6000, 5500, 5200, 5800, 6500, 7000],
      color: "#3B82F6",
    },
    {
      name: "Discharge kWh",
      type: "column",
      data: [4500, 5500, 5000, 4800, 5400, 6000, 6200],
      color: "#F59E0B",
    },
    {
      name: "Charge Track",
      type: "areaspline",
      color: "#A78BFA",
      opacity: 0.5,
      data: [
        { y: 2000, meta: ["11:00–12:00: 800", "15:00–18:00: 1200"] },
        { y: 2200, meta: ["10:00–11:00: 600", "14:00–16:00: 1600"] },
        { y: 1900, meta: ["12:00–13:00: 500", "16:00–18:00: 1400"] },
        { y: 2100, meta: ["11:30–12:30: 1000", "17:00–18:00: 1100"] },
        { y: 2300, meta: ["10:00–11:00: 1300", "15:00–16:00: 1000"] },
        { y: 2500, meta: ["09:00–10:00: 1500", "13:00–15:00: 1000"] },
        { y: 2400, meta: ["11:00–12:00: 2000", "15:00–18:00: 400"] },
      ],
    },
    {
      name: "Discharge Track",
      type: "areaspline",
      color: "#F97316",
      opacity: 0.5,
      data: [
        { y: 2000, meta: ["10:00–11:00: 500", "18:00–20:00: 1500"] },
        { y: 2200, meta: ["11:00–12:00: 1000", "14:00–16:00: 1200"] },
        { y: 1100, meta: ["10:00–12:00: 700", "13:00–15:00: 400"] },
        { y: 3000, meta: ["10:00–11:00: 1500", "17:00–19:00: 1500"] },
        { y: 6700, meta: ["12:00–13:00: 3700", "14:00–15:00: 3000"] },
        { y: 4900, meta: ["11:00–12:00: 2500", "16:00–18:00: 2400"] },
        { y: 9000, meta: ["09:00–10:00: 4000", "17:00–19:00: 5000"] },
      ],
    },
  ]

  // [
  //   { name: "Charge Energy kWh-1", color: "#3B82F6", data: [[t00, 55]] },
  //   { name: "Charge Energy kWh-2", color: "#F59E0B", data: [[t06, 62]] },
  //   { name: "Discharge Energy kWh-1", color: "#A78BFA", data: [[t12, 74]] },
  //   { name: "Discharge Energy kWh-2", color: "#F97316", data: [[t18, 78]] },
  // ];

    const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);
  

  return (
    <GraphLayout
      title={"Charge/Discharge"}
      width={["578px"]}
      height="344px"
      bg={CARD_BG}
      border={`1px solid ${BORDER}`}
      px="16px"
      contentProps={{ mt: 0 }}
      fullScreen
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={series}
        height={248}
        category={["24 Jun", "25 Jun", "26 Jun", "27 Jun", "28 Jun", "29 Jun", "30 Jun"]}
        onExportReady={setExportFunctions}
        props={{
          plotOptions: {
            column: {
              dataLabels: {
                enabled: false
              },
              borderWidth: 0,
              pointWidth: 20,       // thin bars to look clean in small card
              borderRadius: 8,
              groupPadding: 0,
              pointPadding: 0,
            }
          },
          xAxis: {
            type: "category",
            labels: { style: { color: textColor, fontSize: "11px" } },
            lineColor: axisLineColor,
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
            dateTimeLabelFormats: {
              month: '%b %y', // Custom format for months
              year: '%Y' // Format for years if needed
            },
          },
          yAxis: {
            lineColor: "transparent",
            title: { text: null },
            labels: { style: { color: textColor, fontSize: "11px" } },
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            symbolShape: 'square', // Keep this for other chart types, but it won't be applied to column chart symbols
            symbolHeight: 0,
            symbolWidth: 0,
            useHTML: true, // Allow HTML rendering for custom symbols
            itemStyle: {
              overflow: "auto",
              color: textColor,
              fontSize: '12px',
            },
            labelFormatter: function (this: any) {
              // Create a custom square legend symbol with the background color of each series
              // Here we avoid using the default circle symbol
              return '<span style="width: 10px; height: 10px; display: inline-block; background-color: ' + this.color + '; border-radius: 0;"></span> ' + this.name;
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default ChargeDischargeChart;
