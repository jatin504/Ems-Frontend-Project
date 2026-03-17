import { useMemo, useState } from "react";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useColorModeValue } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../types/graphExport/export";

const hour = 60 * 60 * 1000;

/* ================= DUMMY DATA ================= */

const dummySeries = (() => {
  const now = new Date();
  const start = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    6,
    0,
    0
  );

  return [
    {
      type: "spline" as const,
      name: "Voltage (V)",
      data: Array.from({ length: 12 }, (_, i) => [
        start + i * hour,
        450 + Math.random() * 100,
      ]),
      marker: { enabled: true },
    },
    {
      type: "spline" as const,
      name: "Current (A)",
      data: Array.from({ length: 12 }, (_, i) => [
        start + i * hour,
        60 + Math.random() * 40,
      ]),
      marker: { enabled: true },
    },
  ];
})();

/* ================= COMPONENT ================= */

const VoltAmpsCurve = () => {
  const {
    config,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "avg",
    [1, "hour"]
  );

  const seriesForChart = useMemo(() => dummySeries, []);

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
      title="Volt – Amps Curve"
      width={["100%"]}
      height="344px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={280}
        onExportReady={setExportFunctions}
        props={{
          plotOptions: {
            series: {
              lineWidth: 2,
              marker: {
                enabled: true,
                radius: 4,
                lineWidth: 2,
                lineColor: "#FFFFFF",
              },
              states: {
                inactive: { opacity: 1 },
              },
            },
          },

          /* ===== DUAL AXIS (SAFE) ===== */
          yAxis: [
            {
              
              labels: { style: { color: textColor } },
              gridLineColor: gridColor,
            },
            {
              
              labels: { style: { color: textColor } },
              opposite: true,
              gridLineColor: gridColor,
            },
          ],

          xAxis: {
            type: "datetime",
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
          },

          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor },
          },

          legend: {
            align: "center",
            verticalAlign: "bottom",
            itemStyle: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default VoltAmpsCurve;
