import React, { useEffect, useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import WidgetTitle from "../../Common/WidgetTitle";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

import type { ExportFunctions } from "../../../types/graphExport/export";

const SOC = "soc";

interface SocGraphProps {
  selectedDevice: string;
}

const SocGraph: React.FC<SocGraphProps> = ({
  selectedDevice,
}) => {
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#64748B", "#94A3B8");

  const { data, fetchData } = useTimeseriesData();

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
    if (!selectedDevice) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedDevice],
      },

      keys: [
        {
          key: "soc",
          alias: SOC,
          keyType: "common",
        },
      ],

      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: "ASC",
    } as any);
  }, [selectedDevice, timeWindow]);

  const seriesForChart = useMemo(() => {
    const widgetData = data as any;

    if (!widgetData || !selectedDevice) return [];

    const device = widgetData[selectedDevice];

    if (!device) return [];

    console.log("SocGraph data:", data);

    const points = device[SOC] ?? [];

    return [
      {
        name: "SOC",
        type: "spline",
        color: "#22C55E",
        lineWidth: 2.5,
        marker: {
          enabled: false,
        },
        data: points.map((p: any) => [
          Number(p.ts),
          Number(p.value),
        ]),
      },
    ];
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
    title={<WidgetTitle>SOC Trend</WidgetTitle>}
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
      height={250}
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

        yAxis: {
          min: 0,
          max: 100,
          tickInterval: 20,

          title: {
            text: "SOC (%)",
          },

          labels: {
            style: {
              color: subTextColor,
            },
            formatter(this: any) {
              return `${this.value}`;
            },
          },
        },

        plotOptions: {
          spline: {
            lineWidth: 2.5,
            marker: {
              enabled: false,
            },
          },
        },

        tooltip: {
          shared: true,
          formatter: function (this: any) {
            const time = new Date(this.x).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            return `
              <b>${time}</b><br/>
              <span style="color:${this.points[0].color}">●</span>
              SOC :
              <b>${Number(this.points[0].y).toFixed(2)} %</b>
            `;
          },
        },

        legend: {
          enabled: true,
          align: "center",
          verticalAlign: "bottom",
          itemStyle: {
            color: textColor,
            fontSize: "11px",
          },
        },

        credits: {
          enabled: false,
        },

        exporting: {
          enabled: false,
        },
      }}
    />
  </GraphLayout>
);

};

export default SocGraph;