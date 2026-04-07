import { useEffect, useState, useMemo } from "react";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import AreasplineGraph from "../../../Graphs/RevampCharts/AreasplineGraph";
// import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";
import LineGraph from "../../../Graphs/LineGraph";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useColorModeValue } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../../types/graphExport/export";

interface PeakShavingGraphProps {
  threshold?: number;
  hard_limit_kw?: number;
  soft_limit_kw?: number;
  data?: any[];
  max_charge_kw?: number;
  max_discharge_kw?: number;
}

const hour = 60 * 60 * 1000;

const dummySeries = (() => {
  const now = new Date();
  const start = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    12,
    0,
    0
  );

  return [
    {
      type: "areaspline" as const,
      name: "BESS Power",
      data: Array.from({ length: 12 }, (_, i) => [
        start + i * hour,
        Math.random() * 1000,
      ]),
      marker: { enabled: true },
    },
    {
      type: "areaspline" as const,
      name: "Load Power",
      data: Array.from({ length: 12 }, (_, i) => [
        start + i * hour,
        Math.random() * 800,
      ]),
      marker: { enabled: true },
    },
    {
      type: "areaspline" as const,
      name: "Grid Power",
      data: Array.from({ length: 12 }, (_, i) => [
        start + i * hour,
        Math.random() * 600,
      ]),
      marker: { enabled: true },
    },
    {
      type: "areaspline" as const,
      name: "PV Power",
      data: Array.from({ length: 12 }, (_, i) => [
        start + i * hour,
        Math.random() * 1200,
      ]),
      marker: { enabled: true },
    },
  ];
})();

const PowerCurve = ({
  threshold,
  hard_limit_kw,
  soft_limit_kw,
  data: externalData,
  max_charge_kw = 10000,
  max_discharge_kw = 500,
}: PeakShavingGraphProps = {}) => {
  const {
    config: timeWindowPowerCurve,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "avg",
    [1, "hour"],
    60000,
    {
      timeRange: {
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 12,
        intervalType: "hour",
      },
    }
  );

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: [],
        ids: ["plant_1_pcs_2_bank_bank_1"],
      },
      keys: [
        { key: "rated_power", alias: "BESS Power", keyType: "common" },
        { key: "rated_capacity", alias: "Load Power", keyType: "common" },
        { key: "power_factor", alias: "Grid Power", keyType: "common" },
        { key: "reactive_power", alias: "PV Power", keyType: "common" },
      ],
      aggregation: timeWindowPowerCurve.aggregation,
      timeRange: timeWindowPowerCurve.timeRange,
      orderBy: timeWindowPowerCurve.orderBy,
    },
  };

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(fetchingToServerObj.dataSource);
  }, [timeWindowPowerCurve]);

  const thresholdValue = threshold ? Number(threshold) : null;
  const hardLimitValue = hard_limit_kw ? Number(hard_limit_kw) : null;
  const softLimitValue = soft_limit_kw ? Number(soft_limit_kw) : null;

  const seriesForChart = useMemo(() => {
    let series: any[] = [];

    if (data && typeof data === "object") {
      Object.values(data).forEach((deviceObj: any) => {
        if (deviceObj && typeof deviceObj === "object") {
          Object.entries(deviceObj).forEach(([metric, points]: any) => {
            if (Array.isArray(points)) {
              series.push({
                type: "areaspline",
                name: metric,
                data: points.map((p) => [p.ts, p.value]),
                marker: { enabled: true },
                zIndex: 2,
                yAxis: 0, // LEFT AXIS
              });
            }
          });
        }
      });
    }

    const timestamps = series[0]?.data?.map((d: any) => d[0]) || [];

    /* THRESHOLD LINE */
    if (thresholdValue && timestamps.length) {
      series.push({
        type: "line",
        name: "Peak Threshold",
        data: timestamps.map((t: any) => [t, thresholdValue]),
        color: "#FF0000",
        dashStyle: "Dash",
        lineWidth: 3,
        marker: { enabled: false },
        zIndex: 4,
        yAxis: 1, // RIGHT AXIS
      });
    }

    /* SOFT LIMIT LINE */
    if (softLimitValue && timestamps.length) {
      series.push({
        type: "line",
        name: "Soft Limit",
        data: timestamps.map((t: any) => [t, softLimitValue]),
        color: "#FFA500",
        dashStyle: "ShortDash",
        lineWidth: 2,
        marker: { enabled: false },
        zIndex: 3,
        yAxis: 1, // RIGHT AXIS
      });
    }

    /* HARD LIMIT LINE */
    if (hardLimitValue && timestamps.length) {
      series.push({
        type: "line",
        name: "Hard Limit",
        data: timestamps.map((t: any) => [t, hardLimitValue]),
        color: "#8B0000",
        dashStyle: "Dash",
        lineWidth: 2,
        marker: { enabled: false },
        zIndex: 3,
        yAxis: 1, // RIGHT AXIS
      });
    }

    return series;
  }, [data, thresholdValue, hardLimitValue, softLimitValue]);

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
      width={["578px"]}
      height="300px"
      fullScreen
      timeWindow={false}
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <AreasplineGraph
        apiData={seriesForChart}
        height={250}
        enableMultiAxis={true}
        onExportReady={setExportFunctions}
        props={{
          xAxis: {
            type: "datetime",
            crosshair: { color: "rgba(255,255,255,0.15)", width: 1 },
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },

          yAxis: [
            {
              // LEFT AXIS → Power curves
              tickAmount: 6,
              title: { text: null },
              labels: { style: { color: textColor, fontSize: "12px" } },
              gridLineColor: gridColor,
            },
            {
              // RIGHT AXIS → Limits
              title: { text: null },
              opposite: true,
              labels: { style: { color: textColor, fontSize: "12px" } },
              gridLineWidth: 0,
            },
          ],
          plotOptions: {
            series: {
              shadow: false,
              lineWidth: 2,
              marker: {
                enabled: true,
                radius: 4,
                lineWidth: 2,
                lineColor: "#FFFFFF",
              },
            },
          },

          tooltip: {
            shared: true,
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

export default PowerCurve;