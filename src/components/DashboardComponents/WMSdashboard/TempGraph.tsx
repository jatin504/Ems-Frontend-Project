import React, { useEffect, useMemo, useState } from "react";
import { useColorModeValue, Box } from "@chakra-ui/react";
import GraphLayout from "../../../components/Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../../components/Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
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

const TEMP_ALIAS = "bcu_2_highest_pack_temperature";

const TempGraph: React.FC<{ selectedWMS: string }> = ({ selectedWMS }) => {
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

  //  EXPORT FUNCTIONS STATE (ONLY ADDITION)
  const [exportFns, setExportFns] = useState<ExportFunctions | null>(null);

  //  ⭐ Step-1 — DATE STATE
  const [currentDate, setCurrentDate] = useState(new Date());

  //  ⭐ Step-2 — formattedDate + isToday
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

  //  ⭐ Step-3 — Absolute handler
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

  //  ⭐ Step-4 — Prev / Next
  const goPrevDay = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      applyAbsoluteDay(d);
      return d;
    });
  };

  const goNextDay = () => {
    if (isToday) return;

    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);

      const today = new Date();

      const reachedToday =
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();

      if (reachedToday) {
        handleReset(); // back to relative
      } else {
        applyAbsoluteDay(d);
      }

      return d;
    });
  };

  useEffect(() => {
    if (!selectedWMS) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedWMS],
      },
      keys: [
        {
          key: "bcu_2_highest_pack_temperature",
          alias: TEMP_ALIAS,
          keyType: "common",
          type: "spline",
          color: "rgba(255, 99, 132, 1)",
        },
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
    const tempPoints = deviceData[TEMP_ALIAS] || [];

    return [
      {
        name: "Temperature (°C)",
        data: tempPoints.map((p) => [p.ts, p.value]),
        color: "rgba(255, 99, 132, 1)",
        type: "spline",
      },
    ];
  }, [data, selectedWMS]);

  const textColor = useColorModeValue("#062D59", "rgba(255,255,255,0.92)");
  const gridColor = useColorModeValue("#DFDFDF", "rgba(255,255,255,0.12)");
  const lineColor = useColorModeValue(
    "rgba(0,0,0,0.5)",
    "rgba(255,255,255,0.5)"
  );

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">

          <Box fontWeight="600">Temperature</Box>

          <Box
            ml="298px"
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
      titleLengthSVG={100}
      titleLengthLongSVG={720}
      width={["100%"]}
      height={["100%"]}
      fullScreen={true}
      timeWindow
      onTimeWindowChange={(config) => handleTimeWindowChange(config)}
      onReset={handleReset}
      onExport={exportFns}   //  CONNECTED TO 3-DOT MENU
    >
      <SplineGraph
        apiData={seriesForChart}
        height={300}
        onExportReady={setExportFns} //  EXPORT FUNCTIONS RECEIVED
        props={{
          yAxis: {
            tickAmount: 6,
            title: { text: "" },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            crosshair: { color: "rgba(255,255,255,0.15)", width: 1 },
            labels: { style: { color: textColor } },
            lineColor: lineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
            tickInterval: 2 * 60 * 60 * 1000, // 2 hours
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
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

export default TempGraph;
