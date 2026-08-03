import React, { useEffect, useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import WidgetTitle from "../../Common/WidgetTitle";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

import type { ExportFunctions } from "../../../types/graphExport/export";

const VOLTAGE = "Voltage";
const CURRENT = "Current";

interface VoltageCurrentGraphProps {
  selectedDevice: string;
}

const VoltageCurrentGraph: React.FC<VoltageCurrentGraphProps> = ({
  selectedDevice,
}) => {
  const subTextColor = useColorModeValue("#64748B", "#94A3B8");

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    5,
    "day",
    "avg",
    [15, "minute"],
    60000,
    {
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
        interval: 15,
        intervalType: "minute",
      },
    }
  );

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  useEffect(() => {
    fetchData({
      devices: {
        patterns: [],
        ids: selectedDevice ? [selectedDevice] : [],
      },

      keys: [
        {
          key: "voltage",
          alias: VOLTAGE,
          keyType: "common",
        },
        {
          key: "current",
          alias: CURRENT,
          keyType: "common",
        },
      ],

      aggregation: timeWindow.aggregation,

      timeRange: timeWindow.timeRange,

      orderBy: "ASC",
    } as any);
  }, [timeWindow, selectedDevice]);

  const seriesForChart = useMemo(() => {
    const widgetData = data as any;
    if (!widgetData) return [];

    const devices = Object.entries(widgetData);

    const series: any[] = [];

    devices.forEach(([, device]: any) => {
      const voltage = device?.[VOLTAGE] ?? [];
      const current = device?.[CURRENT] ?? [];

      if (voltage.length) {
        series.push({
          name: "Voltage",
          type: "spline",
          color: "#3B82F6",
          yAxis: 0,
          marker: {
            enabled: false,
          },
          lineWidth: 2,
          data: voltage.map((p: any) => [p.ts, Number(p.value)]),
        });
      }

      if (current.length) {
        series.push({
          name: "Current",
          type: "spline",
          color: "#22C55E",
          yAxis: 1,
          marker: {
            enabled: false,
          },
          lineWidth: 2,
          data: current.map((p: any) => [p.ts, Number(p.value)]),
        });
      }
    });

    return series;
  }, [data, selectedDevice]);

  const today = new Date();

  const startTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    8,
    0,
    0,
    0
  ).getTime();

  const endTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    20,
    0,
    0,
    0
  ).getTime();
  return (
  <GraphLayout
    title={<WidgetTitle>Voltage & Current Trend</WidgetTitle>}
    width={["100%"]}
    height="300px"
    fullScreen
    timeWindow
    downloadOption
    onTimeWindowChange={handleTimeWindowChange}
    onReset={handleReset}
    onExport={exportFunctions}
  >
    <SplineGraph
      apiData={seriesForChart}
      height={230}
      onExportReady={setExportFunctions}
      props={{
        xAxis: {
          type: "datetime",
          min: startTime,
          max: endTime,
          tickInterval: 60 * 60 * 1000,
          labels: {
            format: "{value:%H:%M}",
            style: {
              color: subTextColor,
            },
          },
        },

        yAxis: [
          {
            title: {
              text: "Voltage (V)",
            },
            opposite: false,
            labels: {
              formatter(this: any) {
                return `${this.value}`;
              },
            },
          },
          {
            title: {
              text: "Current (A)",
            },
            opposite: true,
            labels: {
              formatter(this: any) {
                return `${this.value}`;
              },
            },
          },
        ],

        tooltip: {
          shared: true,
          formatter: function (this: any) {
            const time = new Date(this.x).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            let s = `<b>${time}</b><br/>`;

            this.points.forEach((p: any) => {
              const unit = p.series.name === "Voltage" ? " V" : " A";

              s += `
                <span style="color:${p.color}">●</span>
                ${p.series.name} :
                <b>${Number(p.y).toFixed(2)}${unit}</b><br/>
              `;
            });

            return s;
          },
        },

        legend: {
          enabled: true,
          align: "center",
          verticalAlign: "bottom",
        },
      }}
    />
  </GraphLayout>
);

};

export default VoltageCurrentGraph;