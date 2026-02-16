import React, { useEffect, useMemo, useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../types/graphExport/export";

/* ================= TYPES ================= */

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

/* ================= CONSTANT ================= */

const VOLTAGE_ALIAS = "Meter Voltage";

/* ================= COMPONENT ================= */

const MeterVoltageGraph: React.FC<{ selectedMeter: string }> = ({
  selectedMeter,
}) => {
  /* ---------- Time window ---------- */
  const { config: timeWindow, handleTimeWindowChange, handleReset } =
    useTimeHandle(
      12,
      "hour",
      "avg",
      [15, "minute"],
      60000,
      {
        timeRange: {
          type: "relative",
          relativeType: "currentDaySoFar",
        },
      }
    );

  const { data, fetchData } = useTimeseriesData();
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  /* ================= API CALL ================= */
  useEffect(() => {
    if (!selectedMeter) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedMeter], 
      },
      keys: [
        {
          key: "dcdc2_battery_side_voltage",
          alias: VOLTAGE_ALIAS,
          keyType: "common",
          type: "spline",
          color: "#22c55e",
        },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any);
  }, [timeWindow, selectedMeter]);

  /* ================= SERIES MAP ================= */
  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData || !selectedMeter) return [];

    const deviceData = widgetData[selectedMeter];
    if (!deviceData) return [];

    const voltagePoints =
      deviceData[VOLTAGE_ALIAS] || deviceData["voltage"] || [];

    if (!voltagePoints.length) return [];

    const match = selectedMeter.match(/_(\d+)$/);
    const suffix = match ? match[1] : "";
    const meterLabel = suffix ? `Meter_${suffix}` : selectedMeter;

    return [
      {
        type: "spline",
        name: `Voltage (V)`,
        data: voltagePoints.map((p) => [p.ts, p.value]),
        marker: { enabled: true },
        color: "#22c55e",
      },
    ];
  }, [data, selectedMeter]);

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

  /* ================= RENDER ================= */

  return (
    <GraphLayout
      title={<Box>Voltage</Box>}
      width={["100%"]}
      height="100%"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={270}
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
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue("#fff", 'rgba(24,24,27,0.95)'),
            style: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default MeterVoltageGraph;
