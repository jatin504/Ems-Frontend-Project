import { useState } from "react";
import { Box, useColorModeValue, Text } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import type { ExportFunctions } from "../../../types/graphExport/export";

/* ================= DUMMY DATA ================= */
const seriesData = [
  {
    type: "spline",
    name: "LT Terminal (R Phase)",
    data: generateDummyData(38),
    color: "#f45b5b",
  },
  {
    type: "spline",
    name: "LT Terminal (Y Phase)",
    data: generateDummyData(36),
    color: "#f7a35c",
  },
  {
    type: "spline",
    name: "LT Terminal (B Phase)",
    data: generateDummyData(35),
    color: "#7cb5ec",
  },
  {
    type: "spline",
    name: "LT Terminal (Neutral)",
    data: generateDummyData(34),
    color: "#434348",
  },
];

export default function TemperatureTrendChart() {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  /* ================= THEME ================= */
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );
  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.16)",
    "rgba(255,255,255,0.06)"
  );

  return (
    <GraphLayout
      title={
        <Text mt="-6px" fontSize="12px" fontWeight="600">
          Temperature Trend
        </Text>
      }                                   
      width="100%"
      height="295px"
      fullScreen
      onExport={exportFunctions}
    >
      <SpineGraph
        apiData={seriesData}
        height={220}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            title: { text: "Temperature (°C)" },
            labels: { style: { color: textColor, fontSize: "10px" } },
            gridLineColor: gridColor,
            tickAmount: 6,
          },
          xAxis: {
            type: "datetime",
            labels: { style: { color: subTextColor, fontSize: "10px" } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor, fontSize: "10px" },
          },
          tooltip: {
            shared: true,
            valueSuffix: " °C",
            backgroundColor: useColorModeValue(
              "#ffffff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
}

/* Dummy Time Series Generator  */
function generateDummyData(base: number) {
  const now = Date.now();
  return Array.from({ length: 20 }).map((_, i) => [
    now - (19 - i) * 60 * 1000,
    base + Math.random() * 2,
  ]);
}
