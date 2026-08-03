import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import type { ExportFunctions } from "../../../types/graphExport/export";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const RtcDispatchTrend = () => {

  // Color mode values
  const bgColor = useColorModeValue("#f7f7f7", "#0f2233");
  const textColor = useColorModeValue("#000", "#fff");
  const labelColor = useColorModeValue("#666", "#8aa4bf");
  const gridColor = useColorModeValue("#e0e0e0", "#1c3a52");
  const legendColor = useColorModeValue("#333", "#cfe8ff");

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  const {
      config: timeWindow,
      handleTimeWindowChange,
      handleReset,
      manualChanges
    } = useTimeHandle(
      12,
      "hour",
      "none",
      [1, "minute"],
      60000,
      {
        timeRange: {
          type: "relative",
          relativeType: "currentDaySoFar",
          interval: 1,
          intervalType: "minute",
        },
      }
    );

  const timeWindowRef = useRef(timeWindow);
  useEffect(() => {
    timeWindowRef.current = timeWindow;
  }, [timeWindow]);

  const { data, fetchData } = useTimeseriesData();

  const buildDataSource = () => ({
    devices: {
      patterns: [],
      ids: ["plant_1_plant_device"],
    },
    keys: [
      {
        key: "total_grid_power",
        alias: "Grid Export (kW)",
        keyType: "common",
      },
      {
        key: "",
        alias: "Target Commitments",
        keyType: "common",
      },
    ],
    aggregation: timeWindowRef.current.aggregation,
    timeRange: timeWindowRef.current.timeRange,
    orderBy: "ASC",
  });

  useEffect(() => {
    fetchData(buildDataSource() as any);
  }, [timeWindow]);

  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;

    if (widgetData && typeof widgetData === "object") {
      const series: any[] = [];

      Object.keys(widgetData).forEach((deviceId) => {
        const deviceSeries = widgetData[deviceId];

        if (!deviceSeries || typeof deviceSeries !== "object") return;

        Object.entries(deviceSeries).forEach(([metric, points]: any) => {
          if (!Array.isArray(points) || !points.length) return;

          series.push({
            type: metric === "Real time Output" || metric === "rated_capacity" ? "areaspline" : "spline",
            name: metric,
            data: points.map((p: any) => [Number(p.ts), Number(p.value)]),
            marker: { enabled: false },
          });
        });
      });

      if (series.length) {
        return series;
      }
    }

    return [
      {
        type: "areaspline" as const,
        name: "Real time Output",
        color: "#7ec8ff",
        fillOpacity: 0.25,
        data: [],
        marker: { enabled: false },
      },
      {
        type: "spline" as const,
        name: "Target Commitments",
        color: "#9cff57",
        data: [],
        marker: { enabled: true },
      },
    ];
  }, [data]);

  const offset = new Date().getTimezoneOffset() * 60000;

  return (
    <GraphLayout
      title="RTC DISPATCH & NET POWER TREND"
      width={["570px"]}
      height="250px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={200}
        onExportReady={setExportFunctions}
        props={{
          chart: {
            events: {
              mouseOut() {
                // hover stuck fix (hard reset)
                this.series.forEach((s: any) => {
                  s.setState("", true);
                });
              },
            },
          },

          plotOptions: {
            series: {
              shadow: false,
              lineWidth: 2,

              // IMPORTANT FIX
              states: {
                inactive: {
                  opacity: 1, // cursor hatate hi sab normal
                },
                hover: {
                  enabled: true,
                  lineWidth: 2,
                },
              },

              marker: {
                enabled: false,
                radius: 4,
                lineWidth: 2,
                lineColor: "#FFFFFF",
              },
            },
          },

          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: {
              style: { color: textColor },
              formatter() {
                return this.value.toFixed(2);
              },
            },
            gridLineColor: gridColor,
          },

          xAxis: {
            type: "datetime",
            crosshair: {
              color: "rgba(255,255,255,0.15)",
              width: 1,
            },
            labels: {
              style: { color: labelColor },
            },
            lineColor: gridColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
            tickInterval: 2 * 60 * 60 * 1000,
            min: !manualChanges
              ? undefined
              : new Date(new Date().setHours(0, 0, 0, 0) - offset).getTime(),
            max: !manualChanges
              ? undefined
              : new Date(new Date().setHours(23, 59, 59, 999) - offset).getTime(),
          },

          tooltip: {
            shared: true,
            hideDelay: 0,
            xDateFormat: "%A, %b %e, %Y %H:%M",
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor },
            valueDecimals: 2,
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

export default RtcDispatchTrend;