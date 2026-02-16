import { useEffect, useMemo, useState } from "react";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useColorModeValue } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const hour = 60 * 60 * 1000;

/* ================= DUMMY FALLBACK ================= */

const dummySeries = (() => {
  const now = new Date();
  const start = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    6,
    0,
    0
  );

  return [
    {
      type: "spline" as const,
      data: Array.from({ length: 12 }, (_, i) => [
        start + i * hour,
        80 + Math.random() * 40,
      ]),
      marker: { enabled: true },
    },
    {
      type: "spline" as const,
      data: Array.from({ length: 12 }, (_, i) => [
        start + i * hour,
        300 + Math.random() * 500,
      ]),
      marker: { enabled: true },
    },
  ];
})();

/* ================= COMPONENT ================= */

const POAvsDCCurrentGraph = () => {
  const {
    config: timeWindow,
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

  /* ================= API CONFIG ================= */

  const fetchingToServerObj = {
    devices: {
      patterns: [],
      ids: ["plant_1_pcs_2_bank_bank_1"],
    },
    keys: [
      {
        key: "soc",
        alias: "DC Current (A)",
        keyType: "common",
      },
      {
        key: "energy_charged_today",
        alias: "POA (W/m²)",
        keyType: "common",
      },
    ],
    aggregation: timeWindow.aggregation,
    timeRange: timeWindow.timeRange,
    orderBy: timeWindow.orderBy,
  };

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(fetchingToServerObj);
  }, [timeWindow]);

  /* ================= MAP API DATA ================= */

  const seriesForChart = useMemo(() => {
    if (data && typeof data === "object") {
      const series: any[] = [];

      Object.values(data).forEach((deviceObj: any) => {
        if (!deviceObj) return;

        Object.entries(deviceObj).forEach(([metric, points]: any) => {
          if (Array.isArray(points)) {
            series.push({
              type: "spline",
              name: metric,
              data: points.map((p) => [p.ts, p.value]),
              marker: { enabled: true },
            });
          }
        });
      });

      return series.length ? series : dummySeries;
    }

    return dummySeries;
  }, [data]);

  /* ================= STYLES ================= */

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

  /* ================= RENDER ================= */

  return (
    <GraphLayout
      title="POA vs DC Current"
      width={["100%"]}
      height="344px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={280}
        onExportReady={setExportFunctions}
        props={{
          plotOptions: {
            series: {
              lineWidth: 2,
              states: {
                inactive: { opacity: 1 },
              },
              marker: {
                enabled: true,
                radius: 4,
                lineWidth: 2,
                lineColor: "#FFFFFF",
              },
            },
          },

          /* 🔥 FIX HERE */
          yAxis: [
  {
    tickAmount: 6,              // ✅ LEFT Y-AXIS → 6 pointers
    title: { text: null },      // ✅ no text
    labels: { style: { color: textColor } },
    gridLineColor: gridColor,
  },
  {
    tickAmount: 6,              // ✅ RIGHT Y-AXIS → 6 pointers
    title: { text: null },      // ✅ no text (removes "Values")
    labels: { style: { color: textColor } },
    opposite: true,
    gridLineColor: gridColor,
  },
],


          xAxis: {
            type: "datetime",
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
          },

          tooltip: {
            shared: true,
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
            itemStyle: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default POAvsDCCurrentGraph;
