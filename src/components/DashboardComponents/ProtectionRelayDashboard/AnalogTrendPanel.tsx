// AnalogTrendPanel.tsx
import React, { useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import type { ExportFunctions } from "../../../types/graphExport/export";

const AnalogTrendPanel: React.FC = () => {
  const now = Date.now();

  const seriesForChart = [
    {
      type: "spline",
      name: "Voltage (V)",
      data: [
        [now - 20 * 60 * 1000, 405],
        [now - 15 * 60 * 1000, 452],
        [now - 10 * 60 * 1000, 438],
        [now - 5 * 60 * 1000, 470],
        [now, 430],
      ],
      color: "#06b6d4",
      marker: { enabled: true },
    },
    {
      type: "spline",
      name: "Current (A)",
      data: [
        [now - 20 * 60 * 1000, 295],
        [now - 15 * 60 * 1000, 330],
        [now - 10 * 60 * 1000, 310],
        [now - 5 * 60 * 1000, 355],
        [now, 320],
      ],
      color: "#ef4444",
      marker: { enabled: true },
    },
  ];

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

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  return (
    <GraphLayout
      title={<Box>Analog Data Trends</Box>}
      width="100%"
      height="100%"
      fullScreen
      timeWindow
      downloadOption
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={300} // 🔑 fixed height like MeterPowerGraph
        onExportReady={setExportFunctions}
        props={{
          chart: {
            spacingTop: 8,
            spacingBottom: 40,
            marginBottom: 70, // THIS FIXES X-AXIS CUT IN FULLSCREEN
          },
          yAxis: {
            tickAmount: 5,
            title: { text: null },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },
          legend: {
  align: "center",
  verticalAlign: "bottom",
  layout: "horizontal",
  y: 30,                 
  itemStyle: { color: textColor },
},

          tooltip: {
            shared: true,
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
};

export default AnalogTrendPanel;
