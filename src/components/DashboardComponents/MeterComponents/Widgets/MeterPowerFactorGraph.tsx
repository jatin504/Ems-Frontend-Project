import React, { useState } from "react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import { useColorModeValue, Box } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../types/graphExport/export";

const MeterPowerFactorGraph: React.FC = () => {
  // Dummy data for power factor
  const seriesForChart = [
    {
      type: "spline",
      name: "Meter Power Factor - MTR_1",
      data: [
        [Date.now() - 3600000, 0.95],
        [Date.now() - 3000000, 0.97],
        [Date.now() - 2400000, 0.94],
        [Date.now() - 1800000, 0.98],
        [Date.now() - 1200000, 0.96],
        [Date.now() - 600000, 0.99],
        [Date.now(), 0.97],
      ],
      marker: { enabled: true, fillColor: "#6366f1" },
      color: "#6366f1",
    },
    {
      type: "spline",
      name: "Meter Power Factor - MTR_2",
      data: [
        [Date.now() - 3600000, 0.92],
        [Date.now() - 3000000, 0.94],
        [Date.now() - 2400000, 0.91],
        [Date.now() - 1800000, 0.95],
        [Date.now() - 1200000, 0.93],
        [Date.now() - 600000, 0.96],
        [Date.now(), 0.94],
      ],
      marker: { enabled: true, fillColor: "#a855f7" },
      color: "#a855f7",
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
      title={<Box>Meter Power Factor</Box>}
      width={["100%"]}
      height={"100%"}
      fullScreen
      timeWindow={false}
      onExport={exportFunctions}
    >
      <SpineGraph
        apiData={seriesForChart}
        height={250}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            crosshair: { color: "rgba(255,255,255,0.15)", width: 1 },
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
            itemStyle: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default MeterPowerFactorGraph;
