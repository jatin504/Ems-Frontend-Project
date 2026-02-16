import React, { useEffect, useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import type { ExportFunctions } from "../../../../types/graphExport/export";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

/* ================= PROPS ================= */

interface IGBTTempGraphProps {
  deviceId: string;
}

/* ================= COMPONENT ================= */

const IGBTTempGraph: React.FC<IGBTTempGraphProps> = ({ deviceId }) => {
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

  /* ---------- TIME WINDOW ---------- */
  const { config: timeWindow } = useTimeHandle(
    12,
    "hour",
    "avg",
    [15, "minute"],
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

  const { data, fetchData } = useTimeseriesData();

  /* ---------- API CALL (DEVICE SPECIFIC) ---------- */
  useEffect(() => {
    if (!deviceId) return;

    fetchData({
      devices: {
        ids: [deviceId], 
        patterns: [],
      },
      keys: [
        {
          key: "bcu_2_lowest_pack_temperature", 
          alias: "IGBT Temp (°C)",
          keyType: "common",
          type: "spline",
          color: "#1dd82dff",
        },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeWindow]);

  /* ---------- DATA → SERIES ---------- */
  const series = useMemo(() => {
    if (!data) return [];

    const deviceData = data[deviceId];
    if (!deviceData) return [];

    const arr = deviceData["IGBT Temp (°C)"];
    if (!arr || !arr.length) return [];

    return [
      {
        type: "spline" as const,
        name: "IGBT Temperature (°C)",
        data: arr.map((p: any) => [p.ts, p.value]),
        marker: { enabled: false },
      },
    ];
  }, [data, deviceId]);

  /* ================= RENDER ================= */

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
          IGBT Temperature
        </span>
      }
      width={["608px"]}
      height="260px"
      fullScreen
      timeWindow={false}
      onExport={exportFunctions}
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
            crosshair: { color: "rgba(255,255,255,0.15)", width: 1 },
            labels: { style: { color: subTextColor, fontSize: "11px" } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor, fontSize: "7px" },
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor, fontSize: "13px" },
          },
        }}
      />
    </GraphLayout>
  );
};

export default IGBTTempGraph;
