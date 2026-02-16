import React, { useEffect, useMemo } from "react";
import { useColorModeValue, Box } from "@chakra-ui/react";
import GraphLayout from "../../../components/Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../../components/Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

interface WidgetPoint {
  ts: number;
  value: number;
}
interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const ENERGY_ALIAS = "bcu_2_energy_charged_today";
const AMPS_ALIAS = "energy_charged_today";

const WindGraph: React.FC<{ selectedWMS: string }> = ({ selectedWMS }) => {
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

    useEffect(() => {
      if (!selectedWMS) return;
      fetchData({
        devices: {
          patterns: [],
          ids: [selectedWMS],
        },
        keys: [
          {
            key: "bcu_2_energy_charged_today",
            alias: ENERGY_ALIAS,
            keyType: "common",
            type: "spline",
            color: "rgba(54, 162, 235, 1)",
          },
          {
            key: "energy_charged_today",
            alias: AMPS_ALIAS,
            keyType: "common",
            type: "spline",
            color: "rgba(255, 99, 132, 1)",
          }
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
    const energyPoints = deviceData[ENERGY_ALIAS] || [];
    const ampsPoints = deviceData[AMPS_ALIAS] || [];

    return [
      {
        name: "Wind speed",
        data: energyPoints.map((p) => [p.ts, p.value]),
        color: "rgba(54, 162, 235, 1)",
        type: "spline",
      },
      {
        name: "Wind Direction",
        data: ampsPoints.map((p) => [p.ts, p.value]),
        color: "rgba(255, 99, 132, 1)",
        type: "spline",
      },
    ];
  }, [data, selectedWMS]);

  const textColor = useColorModeValue("#062D59", "rgba(255,255,255,0.92)");
  const gridColor = useColorModeValue("#DFDFDF", "rgba(255,255,255,0.12)");
  const lineColor = useColorModeValue("rgba(0,0,0,0.5)", "rgba(255,255,255,0.5)");

  return (
    <GraphLayout
      title={<Box>Wind</Box>}
      titleLengthSVG={100}
      titleLengthLongSVG={720}
      width={["100%"]}
      height={["100%"]}
      fullScreen={true}
      timeWindow
      onTimeWindowChange={(config) => handleTimeWindowChange(config)}
      onReset={handleReset}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={300}
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

export default WindGraph;