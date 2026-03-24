import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import { useState, useEffect, useMemo } from "react";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import type { ExportFunctions } from "../../../types/graphExport/export";

const RtcDispatchTrend = () => {

  // Color mode values
  const bgColor = useColorModeValue("#f7f7f7", "#0f2233");
  const textColor = useColorModeValue("#000", "#fff");
  const labelColor = useColorModeValue("#666", "#8aa4bf");
  const gridColor = useColorModeValue("#e0e0e0", "#1c3a52");
  const legendColor = useColorModeValue("#333", "#cfe8ff");

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  const {
    config: timeWindowConfig,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    24,
    "hour",
    "avg",
    [1, "hour"],
    60000,
    {
      timeRange: {
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 24,
        intervalType: "hour",
      },
    }
  );

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData({
      devices: {
        patterns: [],
        ids: ["plant_1_pcs_2_bank_bank_11"],
      },
      keys: [
        { key: "rated_capacity", alias: "Real time Output", keyType: "common" },
        { key: "rated_power", alias: "Target Commitments", keyType: "common" },
      ],
      aggregation: timeWindowConfig.aggregation,
      timeRange: timeWindowConfig.timeRange,
      orderBy: "ASC",
    });
  }, [timeWindowConfig]);

  const seriesForChart = useMemo(() => {
    if (data && typeof data === "object") {
      const series: any[] = [];

      Object.values(data).forEach((deviceObj: any) => {
        if (deviceObj && typeof deviceObj === "object") {
          Object.entries(deviceObj).forEach(([metric, points]: any) => {
            if (!Array.isArray(points)) return;

            series.push({
              type: metric === "Real time Output" || metric === "rated_capacity" ? "areaspline" : "spline",
              name: metric,
              data: points.map((p: any) => [p.ts, p.value]),
              marker: { enabled: true },
            });
          });
        }
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
        marker: { enabled: true },
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

  return (
    <GraphLayout
      title="RTC DISPATCH & NET POWER TREND"
      width={["570px"]}
      height="250px"
      fullScreen
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
                enabled: true,
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
            type: "linear",
            crosshair: { color: "rgba(255,255,255,0.15)", width: 1 },
            labels: { style: { color: labelColor } },
            lineColor: gridColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },

          tooltip: {
            shared: true,
            hideDelay: 0,
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