// components/DashboardComponents/WMSdashboard/LiveIrradiationGraph.tsx

import React, { useEffect, useMemo, useState } from "react";
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

const SOC_ALIAS = "PoA (W/m2)";
const ALARM1_ALIAS = "GHI (W/m2)";

const LiveIrradiationGraph: React.FC<{ selectedWMS: string }> = ({ selectedWMS }) => {
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

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFs = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

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
        handleReset();
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
          key: "soc",
          alias: SOC_ALIAS,
          keyType: "common",
          type: "spline",
          color: "#ef4444",
        },
        {
          key: "alarm_1",
          alias: ALARM1_ALIAS,
          keyType: "common",
          type: "spline",
          color: "#3b82f6",
        },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any);
  }, [timeWindow, selectedWMS]);

  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return [];

    const series: any[] = [];

    const COLORS = {
      [SOC_ALIAS]: "#ef4444",
      [ALARM1_ALIAS]: "#3b82f6",
    };

    Object.keys(widgetData).forEach((deviceId) => {
      if (selectedWMS && deviceId !== selectedWMS) return;

      const deviceData = widgetData[deviceId];
      if (!deviceData) return;

      // SoC series
      const socPoints = deviceData[SOC_ALIAS] || deviceData["soc"] || [];
      if (socPoints.length) {
        const match = deviceId.match(/_(\d+)$/);
        const suffix = match ? match[1] : "";
        const wmsLabel = suffix ? `WMS_${suffix}` : deviceId;
        const cleanLabel = wmsLabel.replace(/^WMS_/, "");
        const seriesName = `${SOC_ALIAS} - ${cleanLabel}`;

        series.push({
          type: "spline",
          name: seriesName,
          data: socPoints.map((p) => [p.ts, p.value]),
          marker: { enabled: true, fillColor: COLORS[SOC_ALIAS] },
          color: COLORS[SOC_ALIAS],
        });
      }

      // Alarm 1 series
      const alarmPoints = deviceData[ALARM1_ALIAS] || deviceData["alarm_1"] || [];
      if (alarmPoints.length) {
        const match = deviceId.match(/_(\d+)$/);
        const suffix = match ? match[1] : "";
        const wmsLabel = suffix ? `WMS_${suffix}` : deviceId;
        const cleanLabel = wmsLabel.replace(/^WMS_/, "");
        const seriesName = `${ALARM1_ALIAS} - ${cleanLabel}`;
        series.push({
          type: "spline",
          name: seriesName,
          data: alarmPoints.map((p) => [p.ts, p.value]),
          marker: { enabled: true, fillColor: COLORS[ALARM1_ALIAS] },
          color: COLORS[ALARM1_ALIAS],
        });
      }
    });

    return series;
  }, [data, selectedWMS]);

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

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">
          <Box fontWeight="600">Live Irradiation</Box>

          <Box
            ml={isFullScreen ? "900px" : "278px"}
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
      height={"100%"}
      fullScreen
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
            labels: { style: { color: subTextColor } },
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
            style: { color: textColor },
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          }
        }}
      />
    </GraphLayout>
  );
};

export default LiveIrradiationGraph;
