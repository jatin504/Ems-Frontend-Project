import React, { useState, useMemo, useEffect } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../../components/Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
// import type { ExportFunctions } from "../../../../types/graphExport/export";
type ExportFunctions = any; // TODO: Replace 'any' with the correct type if available
import ColumnGraph from "../../../components/Graphs/RevampCharts/ColumnGraph";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

type DailyIsolationGraphProps = {
  selectedWMS: string;
};

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

const DailyIsolationGraph: React.FC<DailyIsolationGraphProps> = ({ selectedWMS }) => {
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  const { config: timeWindow, handleTimeWindowChange, handleReset } =
    useTimeHandle(
      12,
      "hour",
      "last",
      [1, "day"],
      60000,
      {
        timeRange: {
          type: "last",
          relativeType: "currentDaySoFar",
          interval: 7,
          intervalType: "day",
        },
      }
    );

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!selectedWMS) return;
    fetchData({
      devices: {
        patterns: [],
        ids: [selectedWMS],
      },
      keys: [
        {
          key: "rated_power",
          alias: "rated_power",
          keyType: "common",
          type: "column",
          color: "#38BDF8",
        },
        {
          key: "phase_a_voltage",
          alias: "phase_a_voltage",
          keyType: "common",
          type: "column",
          color: "#F59E42",
        },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any);
  }, [timeWindow, selectedWMS]);

  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData || !selectedWMS || !widgetData[selectedWMS]) return [];
    const deviceData = widgetData[selectedWMS];
    const ampsPoints = deviceData["rated_power"] || [];
    const voltagePoints = deviceData["phase_a_voltage"] || [];
    return [
      {
        type: "column" as const,
        name: "Cum PoA (kWh/m2)",
        color: "#38BDF8",
        data: ampsPoints.map((p) => [p.ts, p.value]),
      },
      {
        type: "column" as const,
        name: "Cum GHI (kWh/m2)",
        color: "#F59E42",
        data: voltagePoints.map((p) => [p.ts, p.value]),
      },
    ];
  }, [data, selectedWMS]);

  return (
    <GraphLayout
      title="Daily Isolation"
      width={["100%"]}
      height="354px"
      fullScreen
      timeWindow
      onTimeWindowChange={(config) => handleTimeWindowChange(config)}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <ColumnGraph
        apiData={seriesForChart}
        height={300}
        onExportReady={setExportFunctions}
        props={{
          plotOptions: {
            column: {
              dataLabels: { enabled: false },
              borderWidth: 0,
              borderRadius: 8,
              grouping: true,
              groupPadding: 1,   // Maximum space between groups
              pointPadding: 0.3, // Maximum space between points
            }
          },
          xAxis: {
            type: "datetime",
            labels: { style: { color: textColor, fontSize: "11px" } },
            lineColor: axisLineColor,
            gridLineWidth: 1,
            gridLineDashStyle: "ShortDot",
            gridLineColor: gridColor,
            dateTimeLabelFormats: {
              month: '%b %y',
              year: '%Y'
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
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor },
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            symbolShape: 'square',
            symbolHeight: 0,
            symbolWidth: 0,
            useHTML: true,
            itemStyle: {
              overflow: "auto",
              color: textColor,
              fontSize: '12px',
            },
            labelFormatter: function (this: any) {
              return '<span style="width: 10px; height: 10px; display: inline-block; background-color: ' + this.color + '; border-radius: 0;"></span> ' + this.name;
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default DailyIsolationGraph;