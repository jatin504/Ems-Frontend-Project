import React, { useEffect, useMemo, useRef, useState } from "react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import { useColorModeValue } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../../types/graphExport/export";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

/* PROPS */
interface ACvsDCGraphProps {
  deviceId: string;
}

/* HELPERS */
const intervalToMs = (value?: number, unit?: string) => {
  if (!value || !unit) return 60_000;

  switch (unit) {
    case "second":
      return value * 1000;
    case "minute":
      return value * 60 * 1000;
    case "hour":
      return value * 60 * 60 * 1000;
    default:
      return 60_000;
  }
};

/* COMPONENT */
const ACvsDCGraph: React.FC<ACvsDCGraphProps> = ({ deviceId }) => {
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

  /* TIME WINDOW */
  const { config: timeWindow } = useTimeHandle(
    12,
    "hour",
    "avg",
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

  const { data, loading, fetchData } = useTimeseriesData();

  /* DATASOURCE BUILDER */
  const buildDataSource = () => ({
    devices: {
      ids: [deviceId],
      patterns: [],
    },
    keys: [
      {
        key: "soc",
        alias: "AC Power (kW)",
        keyType: "common",
        type: "spline",
        color: "#2563EB",
      },
      {
        key: "rated_power",
        alias: "DC Power (kW)",
        keyType: "common",
        type: "spline",
        color: "#16A34A",
      },
    ],
    aggregation: timeWindowRef.current.aggregation,
    timeRange: timeWindowRef.current.timeRange,
    orderBy: "ASC",   //"timeWindowRef.current.orderBy",
  });

  /* INITIAL + TIME WINDOW CHANGE FETCH */
  useEffect(() => {
    if (!deviceId) return;
    fetchData(buildDataSource() as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeWindow]);

  /* AUTO REFRESH BASED ON INTERVAL */
  useEffect(() => {
    if (!deviceId) return;

    const refreshMs = intervalToMs(
      timeWindow.timeRange.interval,
      timeWindow.timeRange.intervalType
    );

    const id = setInterval(() => {
      fetchData(buildDataSource() as any);
    }, refreshMs);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deviceId,
    timeWindow.timeRange.interval,
    timeWindow.timeRange.intervalType,
  ]);

  /* DATA → SERIES */
  const series = useMemo(() => {
    if (!data || !deviceId) return [];

    const deviceData = data[deviceId];
    if (!deviceData) return [];

    return Object.keys(deviceData).map((alias) => ({
      type: "spline" as const,
      name: alias,
      data: deviceData[alias].map((p: any) => [p.ts, p.value]),
      marker: { enabled: false },
    }));
  }, [data, deviceId]);

  /* RENDER */
  return (
    <GraphLayout
      title={
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            fontFamily: "Poppins",
          }}
        >
          AC vs DC Power
        </span>
      }
      width={["608px"]}
      height="260px"
      fullScreen
      timeWindow={false}
      onExport={exportFunctions}
      loading={loading}
    >
      <SpineGraph
        apiData={series}
        height={200}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: {
              style: {
                color: useColorModeValue("#000000", "#ffffff"),
                fontSize: "11px",
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
              style: { color: subTextColor, fontSize: "11px" },
            },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor, fontSize: "13px" },
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor, fontSize: "7px" },
          },
        }}
      />
    </GraphLayout>
  );
};

export default ACvsDCGraph;
