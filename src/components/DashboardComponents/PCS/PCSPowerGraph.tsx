import React, { useEffect, useMemo, useState } from "react";
import { useColorModeValue, Select, Box } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
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

interface DeviceOption {
  id: string;
  label: string;
}

const POWER_ALIAS = "Power (kW)";

const PCSPowerGraph: React.FC = () => {
  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
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

  const [selectedDevice, setSelectedDevice] = useState("ALL");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  /*  DATE STATE */
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
      orderBy: timeWindow.orderBy,
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

  const dataSource = {
    devices: {
      patterns: ["_bank_bank_"],
      ids: [],
    },
    keys: [
      {
        key: "active_power",
        alias: POWER_ALIAS,
        keyType: "common",
        type: "spline",
      },
    ],
    aggregation: timeWindow.aggregation,
    timeRange: timeWindow.timeRange,
    orderBy: timeWindow.orderBy,
  };

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(dataSource as any);
  }, [timeWindow]);

  useEffect(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return;

    const options = Object.keys(widgetData).map((deviceId) => {
      const suf = deviceId.match(/_(\d+)$/)?.[1];
      return { id: deviceId, label: suf ? `PCS_${suf}` : deviceId };
    });

    options.sort((a, b) => a.label.localeCompare(b.label));
    setDeviceOptions(options);
  }, [data]);

  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return [];

    const COLORS = [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#84cc16",
      "#10b981",
      "#06b6d4",
      "#3b82f6",
      "#6366f1",
      "#a855f7",
      "#ec4899",
    ];

    const series: any[] = [];

    Object.keys(widgetData).forEach((deviceId) => {
      if (selectedDevice !== "ALL" && selectedDevice !== deviceId) return;

      const pts = widgetData[deviceId]?.[POWER_ALIAS];
      if (!pts?.length) return;

      const suf = deviceId.match(/_(\d+)$/)?.[1] || deviceId;

      const colorIndex =
        !isNaN(Number(suf))
          ? (parseInt(suf) - 1) % COLORS.length
          : series.length % COLORS.length;

      series.push({
        type: "spline",
        name: `Power(kW)-${suf}`,
        data: pts.map((p) => [p.ts, p.value]),
        marker: { enabled: true },
        color: COLORS[colorIndex],
      });
    });

    return series;
  }, [data, selectedDevice]);

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
          <Box display="flex" alignItems="center" gap={3}>
            <Box fontWeight="600">Power</Box>

            <Select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              size="xs"
              minW="90px"
              height="24px"
              fontSize="11px"
              bg={useColorModeValue("gray.100", "gray.700")}
            >
              <option value="ALL">ALL</option>
              {deviceOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </Box>

          <Box ml={isFullScreen ? "900px" : "88px"}
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
      <SpineGraph
        apiData={seriesForChart}
        height={200}
        onExportReady={setExportFunctions}
        props={{
          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
          },
        }}
      />
    </GraphLayout>
  );
};

export default PCSPowerGraph;