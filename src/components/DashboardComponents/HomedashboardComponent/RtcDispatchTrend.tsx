import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import AreaSplineGraph from "../../Graphs/AreaSplineGraph";
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
  const textColor = useColorModeValue("#000", "#fff");
  const gridColor = useColorModeValue("#e0e0e0", "#1c3a52");

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
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

  // Current time
  const [currentTime, setCurrentTime] = useState(Date.now());

  // ---------------------------------------------------------
  // FETCH DATA
  // ---------------------------------------------------------
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
    ],

    aggregation: timeWindowRef.current.aggregation,

    timeRange: timeWindowRef.current.timeRange,

    orderBy: "ASC",
  });

  useEffect(() => {
    fetchData(buildDataSource() as any);

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
      fetchData(buildDataSource() as any);
    }, 60000);

    return () => clearInterval(interval);
  }, [timeWindow]);

  // ---------------------------------------------------------
  // TODAY START / END
  // ---------------------------------------------------------
  const todayStart = useMemo(() => {
    const now = new Date(currentTime);

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    ).getTime();
  }, [currentTime]);

  const todayEnd = useMemo(() => {
    const now = new Date(currentTime);

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    ).getTime();
  }, [currentTime]);

  // ---------------------------------------------------------
  // CHART DATA
  // ---------------------------------------------------------
  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;

    if (!widgetData) return [];

    const series: any[] = [];

    Object.keys(widgetData).forEach((deviceId) => {
      const deviceSeries = widgetData[deviceId];

      if (!deviceSeries || typeof deviceSeries !== "object") return;

      Object.entries(deviceSeries).forEach(([metric, points]) => {
        if (!Array.isArray(points) || points.length === 0) return;

        const chartData = points
          .map((point) => [
            Number(point.ts),
            Number(point.value),
          ])
          .sort((a, b) => a[0] - b[0]);

        series.push({
          type: "areaspline",
          name: metric,
          color: "#6DA2FF",
          data: chartData,
          marker: {
            enabled: false,
          },
        });
      });
    });

    return series;
  }, [data]);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
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
      <AreaSplineGraph
        apiData={seriesForChart}
        height={200}
        onExportReady={setExportFunctions}
        axisLabelColor={textColor}
        gridColor={gridColor}
        lineColor={gridColor}
        tooltipBg={useColorModeValue(
          "#fff",
          "rgba(24,24,27,0.95)"
        )}
        tooltipColor={textColor}
        legendColor={textColor}
        props={{
          xAxis: {
            type: "time",
            min: todayStart,
            max: todayEnd,
            splitNumber: 12,
          },

          yAxis: {
            tickAmount: 6,
            title: {
              text: null,
            },
            labels: {
              color: textColor,
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default RtcDispatchTrend;