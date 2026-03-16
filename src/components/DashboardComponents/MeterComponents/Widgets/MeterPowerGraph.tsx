import React, { useEffect, useMemo, useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../types/graphExport/export";

/* ================= TYPES ================= */

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

/* ================= CONSTANT ================= */

const POWER_ALIAS = "Meter Power";

/* ================= COMPONENT ================= */

const MeterPowerGraph: React.FC<{ selectedMeter: string }> = ({
  selectedMeter,
}) => {
  /* ---------- Time window ---------- */
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

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());

  /* ================= API CALL ================= */
  useEffect(() => {
    if (!selectedMeter) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedMeter], //  ONLY selected meter
      },
      keys: [
        {
          key:"soc",
          alias: POWER_ALIAS,
          keyType: "common",
          type: "spline",
          color: "#22c55e",
        },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: "ASC", // Ensure consistent ordering for time series",
    } as any);
  }, [timeWindow, selectedMeter]);

  const formattedDate = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    const d = String(currentDate.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
  }, [currentDate]);

  const isToday = useMemo(() => {
    const t = new Date();
    return (
      currentDate.getFullYear() === t.getFullYear() &&
      currentDate.getMonth() === t.getMonth() &&
      currentDate.getDate() === t.getDate()
    );
  }, [currentDate]);

  const applyAbsoluteDay = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    handleTimeWindowChange({
      aggregation: timeWindow.aggregation,
      orderBy: "ASC",
      timeRange: {
        type: "absolute",
        startTs: start.getTime(),
        endTs: end.getTime(),
      },
    });
  };

  const goPrevDay = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      applyAbsoluteDay(d);
      return d;
    });
  };

  const goNextDay = () => {
    if (isToday) return;

    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);

      const today = new Date();

      const reachedToday =
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();

      if (reachedToday) {
        handleReset();
      } else {
        applyAbsoluteDay(d);
      }

      return d;
    });
  };

  /* ================= SERIES ================= */
  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData || !selectedMeter) return [];

    const deviceData = widgetData[selectedMeter];
    if (!deviceData) return [];

    const powerPoints =
      deviceData[POWER_ALIAS] || deviceData["soc"] || [];

    if (!powerPoints.length) return [];

    const match = selectedMeter.match(/_(\d+)$/);
    const suffix = match ? match[1] : "";
    const meterLabel = suffix ? `Meter_${suffix}` : selectedMeter;

    return [
      {
        type: "spline",
        name: "Power (kW)",
        data: powerPoints.map((p) => [p.ts, p.value]),
        marker: { enabled: true },
        color: "#22c55e",
      },
    ];
  }, [data, selectedMeter]);

  /* ================= THEME ================= */
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

  /* ================= RENDER ================= */
  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">

          <Box fontWeight="600">Power</Box>

          <Box
            ml="158px"
            display="flex"
            alignItems="center"
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="6px"
            px={2}
            height="22px"
            gap={2}
          >
            <Box cursor="pointer" fontSize="12px" onClick={goPrevDay}>‹</Box>

            <Box fontSize="11px" fontWeight="600" minW="78px" textAlign="center">
              {formattedDate}
            </Box>

            <Box
              cursor={isToday ? "not-allowed" : "pointer"}
              opacity={isToday ? 0.35 : 1}
              fontSize="12px"
              onClick={goNextDay}
            >
              ›
            </Box>
          </Box>

        </Box>
      }
      width={["100%"]}
      height="100%"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={270}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            tickAmount: 6,
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue("#fff", 'rgba(24,24,27,0.95)'),
            style: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default MeterPowerGraph;
