import React, { useMemo, useState, useEffect } from "react";
import { useColorModeValue, Box, Select } from "@chakra-ui/react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import type { ExportFunctions } from "../../../types/graphExport/export";

/* ---------------- MOCK DATA ---------------- */
interface DeviceData {
  currentData: [number, number][];
  voltageData: [number, number][];
  socData: [number, number][];
}

const dummyData: { [deviceId: string]: DeviceData } = {
  "energy_block_1": {
    currentData: [
      [Date.UTC(2025, 11, 24, 9, 0), -150],
      [Date.UTC(2025, 11, 24, 12, 0), 0],
      [Date.UTC(2025, 11, 24, 15, 0), 120],
      [Date.UTC(2025, 11, 24, 18, 0), -20],
    ],
    voltageData: [
      [Date.UTC(2025, 11, 24, 9, 0), 850],
      [Date.UTC(2025, 11, 24, 12, 0), 900],
      [Date.UTC(2025, 11, 24, 15, 0), 780],
      [Date.UTC(2025, 11, 24, 18, 0), 820],
    ],
    socData: [
      [Date.UTC(2025, 11, 24, 9, 0), 300],
      [Date.UTC(2025, 11, 24, 12, 0), 550],
      [Date.UTC(2025, 11, 24, 15, 0), 650],
      [Date.UTC(2025, 11, 24, 18, 0), 500],
    ],
  },
  "energy_block_2": {
    currentData: [
      [Date.UTC(2025, 11, 24, 9, 0), -140],
      [Date.UTC(2025, 11, 24, 12, 0), 10],
      [Date.UTC(2025, 11, 24, 15, 0), 130],
      [Date.UTC(2025, 11, 24, 18, 0), -30],
    ],
    voltageData: [
      [Date.UTC(2025, 11, 24, 9, 0), 860],
      [Date.UTC(2025, 11, 24, 12, 0), 910],
      [Date.UTC(2025, 11, 24, 15, 0), 790],
      [Date.UTC(2025, 11, 24, 18, 0), 830],
    ],
    socData: [
      [Date.UTC(2025, 11, 24, 9, 0), 320],
      [Date.UTC(2025, 11, 24, 12, 0), 570],
      [Date.UTC(2025, 11, 24, 15, 0), 670],
      [Date.UTC(2025, 11, 24, 18, 0), 520],
    ],
  },
  "energy_block_3": {
    currentData: [
      [Date.UTC(2025, 11, 24, 9, 0), -160],
      [Date.UTC(2025, 11, 24, 12, 0), -10],
      [Date.UTC(2025, 11, 24, 15, 0), 110],
      [Date.UTC(2025, 11, 24, 18, 0), -10],
    ],
    voltageData: [
      [Date.UTC(2025, 11, 24, 9, 0), 840],
      [Date.UTC(2025, 11, 24, 12, 0), 890],
      [Date.UTC(2025, 11, 24, 15, 0), 770],
      [Date.UTC(2025, 11, 24, 18, 0), 810],
    ],
    socData: [
      [Date.UTC(2025, 11, 24, 9, 0), 280],
      [Date.UTC(2025, 11, 24, 12, 0), 530],
      [Date.UTC(2025, 11, 24, 15, 0), 630],
      [Date.UTC(2025, 11, 24, 18, 0), 480],
    ],
  },
};

/* ---------------- EVENT BUILDER ---------------- */
const buildSocEvents = (data: [number, number][]) => {
  const plotBands: any[] = [];
  let start = data[0][0];
  let prevSoc = data[0][1];
  let mode: "charge" | "discharge" | null = null;

  const index = { charge: 1, discharge: 1 };

  for (let i = 1; i < data.length; i++) {
    const [time, soc] = data[i];
    const currentMode =
      soc > prevSoc ? "charge" : soc < prevSoc ? "discharge" : mode;

    if (mode && currentMode !== mode) {
      plotBands.push(createBand(start, data[i - 1][0], mode, index));
      start = data[i - 1][0];
    }

    mode = currentMode;
    prevSoc = soc;
  }

  // extend last band to avoid right cut
  plotBands.push(
    createBand(
      start,
      data[data.length - 1][0] + 5 * 60 * 1000,
      mode,
      index
    )
  );

  return plotBands;
};

const createBand = (
  from: number,
  to: number,
  mode: "charge" | "discharge" | null,
  index: { charge: number; discharge: number }
) => {
  const isCharge = mode === "charge";
  const label = `${isCharge ? "Charge" : "Discharge"} Event-${index[mode!]++}`;

  return {
    from,
    to,
    color: isCharge
      ? "rgba(0, 180, 0, 0.15)"
      : "rgba(220, 0, 0, 0.15)",
    label: {
      text: label,
      style: {
        fontWeight: "bold",
        color: isCharge ? "#006400" : "#8B0000",
      },
    },
  };
};

/* ---------------- COMPONENT ---------------- */
const EnergyBlockChart: React.FC = () => {

  const plotBands = useMemo(() => {
    const allSocData: [number, number][] = [];
    Object.values(dummyData).forEach((device) => {
      if (device.socData) allSocData.push(...device.socData);
    });
    if (allSocData.length === 0) return [];
    // For simplicity, use the first device's SoC for plotBands
    return buildSocEvents(Object.values(dummyData)[0]?.socData || []);
  }, []);

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

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

  const seriesForChart = useMemo(() => {
    const series: any[] = [];
    const COLORS = [
      "#6DA2FF",
      "#34D399",
      "#F59E0B",
      "#ef4444",
      "#f97316",
      "#84cc16",
      "#06b6d4",
      "#3b82f6",
      "#6366f1",
      "#a855f7",
    ];

    Object.keys(dummyData).forEach((deviceId, idx) => {
      const device = dummyData[deviceId];
      if (!device) return;

      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : "";
      const blockNumber = suffix ? suffix : "1";

      series.push({
        name: `Energy Block Current ${blockNumber}`,
        data: device.currentData,
        color: COLORS[idx % COLORS.length],
        lineWidth: 2,
        marker: { enabled: false },
        type: "spline",
      });
      series.push({
        name: `Energy Block Voltage ${blockNumber}`,
        data: device.voltageData,
        color: COLORS[(idx + 1) % COLORS.length],
        lineWidth: 2,
        marker: { enabled: false },
        type: "spline",
      });
      series.push({
        name: `State of Charge`,
        data: device.socData,
        color: COLORS[(idx + 2) % COLORS.length],
        lineWidth: 2,
        marker: { enabled: false },
        type: "spline",
      });
    });

    return series;
  }, []);

  return (
    <GraphLayout
      title={<Box>Energy Block Analytics</Box>}
      width={["100%"]}
      height={"320px"}
      fullScreen
      timeWindow={false}
      onExport={exportFunctions}
    >
      <SpineGraph
        apiData={seriesForChart}
        height={280}
        onExportReady={setExportFunctions}
        props={{
          /*CHART FIX (important for 100%) */
          chart: {
            spacingRight: 40,
            marginRight: 40,
            marginBottom: 120,
          },

          yAxis: {
            tickAmount: 6,
            // title: { text: "Values" },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },

          xAxis: {
            type: "datetime",
            plotBands,
            crosshair: {
              color: "rgba(255,255,255,0.15)",
              width: 1,
            },
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,

            /* RIGHT CUT FIX */
            endOnTick: false,
            startOnTick: false,
            minPadding: 0.02,
            maxPadding: 0.1,
            showLastLabel: true,
          },

          legend: {
            enabled: true,
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          },

          tooltip: {
            shared: true,
            xDateFormat: "%d %b %Y %H:%M",
            formatter: function (this: any) {
              let tooltip = `<b>${new Date(this.x).toLocaleString()}</b><br/>`;
              this.points.forEach((point: any) => {
                let suffix = "";
                const seriesName = point.series.name;
                if (seriesName.includes("Current")) suffix = " A";
                else if (seriesName.includes("Voltage")) suffix = " V";
                else if (seriesName.includes("State of Charge")) suffix = " %";
                tooltip += `${seriesName}: <b>${point.y}${suffix}</b><br/>`;
              });
              return tooltip;
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default EnergyBlockChart;
