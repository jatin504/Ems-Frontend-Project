import React, { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../../components/Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import AeraspineGraph from "../../../components/Graphs/RevampCharts/AreasplineGraph";
import type { ExportFunctions } from "../../../types/graphExport/export";

const TempWindGraph: React.FC = () => {
  const textColor = useColorModeValue("#062D59", "rgba(255,255,255,0.92)");
  const gridColor = useColorModeValue("#DFDFDF", "rgba(255,255,255,0.12)");
  const lineColor = useColorModeValue("rgba(0,0,0,0.5)", "rgba(255,255,255,0.5)");

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  // ===== Dummy chart data =====
  const dummySeries = [
    {
      name: "Temperature (°C)",
      data: [
        [Date.now() - 5 * 3600000, 25],
        [Date.now() - 4 * 3600000, 26],
        [Date.now() - 3 * 3600000, 28],
        [Date.now() - 2 * 3600000, 30],
        [Date.now() - 1 * 3600000, 32],
      ],
      color: "rgba(255, 99, 132, 1)",
      type: "areaspline",
    },
    {
      name: "Wind Speed (m/s)",
      data: [
        [Date.now() - 5 * 3600000, 3.5],
        [Date.now() - 4 * 3600000, 4.2],
        [Date.now() - 3 * 3600000, 5.1],
        [Date.now() - 2 * 3600000, 4.8],
        [Date.now() - 1 * 3600000, 6.0],
      ],
      color: "rgba(54, 162, 235, 1)",
      type: "areaspline",
    },
  ];

  return (
    <GraphLayout
      title="Temperature & Wind"
      titleLengthSVG={150}
      titleLengthLongSVG={720}
      width={["100%"]}
      height={["100%"]}
      fullScreen={true}
      onExport={exportFunctions}
    >
      <AeraspineGraph
        apiData={dummySeries}
        height={300}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            tickAmount: 6,
            title: { text: "" },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            crosshair: { color: 'rgba(255,255,255,0.15)', width: 1 },
            labels: { style: { color: textColor } },
            lineColor: lineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
            tickInterval: 2 * 60 * 60 * 1000, // 2 hours
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue("#fff", 'rgba(24,24,27,0.95)'),
            style: { color: textColor },
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

export default TempWindGraph;