import React, { useEffect, useMemo, useRef, useState } from "react";
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
const COLORS = [
  "#2dd817ff",
  "#f97316",
  "#cc0ee5ff",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
];
const intervalToMs = (interval: number, unit: string) => {
  switch (unit) {
    case "second":
      return interval * 1000;
    case "minute":
      return interval * 60 * 1000;
    case "hour":
      return interval * 60 * 60 * 1000;
    default:
      return 60_000;
  }
};

interface StringPowerGraphProps {
  height?: string | number;
}

const StringPowerGraph: React.FC<StringPowerGraphProps> = ({ height = 350 }) => {
  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
    manualChanges
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

  const [selectedDevice, setSelectedDevice] = useState<string>("ALL");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);
  const { data, fetchData } = useTimeseriesData();

  // Use the same datasource as InverterPowerGraph
  const buildDataSource = () => ({
    devices: {
      patterns: ["_bank_bank_"],
      ids: [] as string[],
    },
    keys: [
      {
        key: "active_power",
        alias: POWER_ALIAS,
        keyType: "common",
        type: "spline",
      },
    ],
    aggregation: timeWindowRef.current.aggregation,
    timeRange: timeWindowRef.current.timeRange,
    orderBy: "ASC",
  });

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

  useEffect(() => {
    fetchData(buildDataSource() as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindow]);

  useEffect(() => {
    const { interval, intervalType } = timeWindow.timeRange;
    const refreshMs = intervalToMs(interval, intervalType);
    const intervalId = setInterval(() => {
      fetchData(buildDataSource() as any);
    }, refreshMs);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindow.timeRange.interval, timeWindow.timeRange.intervalType]);

  useEffect(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) {
      setDeviceOptions([]);
      return;
    }
    const options: DeviceOption[] = Object.keys(widgetData).map((deviceId) => {
      const match = deviceId.match(/_(\d+)$/);
      const suffix = match ? match[1] : "";
      return {
        id: deviceId,
        label: suffix ? `INV_${suffix}` : deviceId,
      };
    });
    options.sort((a, b) => a.label.localeCompare(b.label));
    setDeviceOptions(options);
  }, [data]);

  useEffect(() => {
    if (
      selectedDevice !== "ALL" &&
      !deviceOptions.find((d) => d.id === selectedDevice)
    ) {
      setSelectedDevice("ALL");
    }
  }, [deviceOptions, selectedDevice]);

  // Only show one series at a time: MPPT-1, MPPT-2, ...
  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return [];
    const deviceIds = Object.keys(widgetData).filter((deviceId) => deviceId.includes("_bank_bank_"));
    deviceIds.sort();
    let deviceIdToShow = "";
    let legendIdx = 0;
    if (selectedDevice && deviceIds.includes(selectedDevice)) {
      deviceIdToShow = selectedDevice;
      legendIdx = deviceIds.indexOf(selectedDevice);
    } else if (deviceIds.length > 0) {
      deviceIdToShow = deviceIds[0];
      legendIdx = 0;
    } else {
      return [];
    }
    const points = widgetData[deviceIdToShow]?.[POWER_ALIAS];
    if (!points?.length) return [];
    return [{
      type: "spline",
      name: `String-${legendIdx + 1}`,
      data: points.map((p) => [p.ts, p.value]),
      marker: { enabled: true },
      color: COLORS[legendIdx % COLORS.length],
    }];
  }, [data, selectedDevice]);

  const applyAbsoluteDay = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    handleTimeWindowChange({
      aggregation: timeWindowRef.current.aggregation,
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

          {/* LEFT DROPDOWN */}
          <Select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            size="xs"
            minW="90px"
            height="24px"
            fontSize="11px"
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="4px"
          >
            {deviceOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </Select>

          {/* ⭐ DATE NAVIGATOR */}
          <Box
            ml="278px"
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
      height={height}
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SpineGraph
        apiData={seriesForChart}
        height={typeof height === 'number' ? height - 90 : height}
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
            crosshair: { color: "rgba(255,255,255,0.15)" },
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
            tickInterval: 60 * 60 * 2 * 1000,
            min : !manualChanges ? undefined : new Date(new Date().setHours(4, 0, 0, 0)).getTime(),
            max : !manualChanges ? undefined : new Date(new Date().setHours(20, 0, 0, 0)).getTime()
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default StringPowerGraph;