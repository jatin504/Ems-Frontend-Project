import React, { useEffect, useMemo, useRef, useState } from "react";
import { useColorModeValue, Select, Box } from "@chakra-ui/react";
import NonCommunicationIndicator from "../../../Common/NonCommunicationIndicator";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import WidgetTitle from "../../../Common/WidgetTitle";
import SpineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../../types/graphExport/export";
import useDateFormatterMargin from "../../../DateFormatter";

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

const DC_VOLTAGE_ALIAS = "DC Voltage (V)";

const intervalToMs = (interval: number, unit: string) => {
  switch (unit) {
    case "second":
      return interval * 1000;
    case "minute":
      return interval * 60 * 1000;
    case "hour":
      return interval * 60 * 60 * 1000;
    default:
      return 60000;
  }
};

const DCVoltageChart: React.FC = () => {
  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
    manualChanges,
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

  const [selectedDevice, setSelectedDevice] = useState("ALL");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const dateFormatterMargin = useDateFormatterMargin({
    fullScreenMargin: "900",
    normalMargin: "28",
  });

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData({
      devices: {
        patterns: ["_inverter_inverter_"],
        ids: [],
      },
      keys: [
        {
          key: "voltage",
          alias: DC_VOLTAGE_ALIAS,
          keyType: "common",
          type: "spline",
        },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: "ASC",
    } as any);
  }, [timeWindow]);

  useEffect(() => {
    const { interval, intervalType } = timeWindow.timeRange;
    const refreshMs = intervalToMs(interval, intervalType);

    const id = setInterval(() => {
      fetchData({
        devices: {
          patterns: ["_inverter_inverter_"],
          ids: [],
        },
        keys: [
          {
            key: "voltage",
            alias: DC_VOLTAGE_ALIAS,
            keyType: "common",
            type: "spline",
          },
        ],
        aggregation: timeWindowRef.current.aggregation,
        timeRange: timeWindowRef.current.timeRange,
        orderBy: "ASC",
      } as any);
    }, refreshMs);

    return () => clearInterval(id);
  }, [timeWindow.timeRange.interval, timeWindow.timeRange.intervalType]);

  useEffect(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) {
      setDeviceOptions([]);
      return;
    }

    const options = Object.keys(widgetData).map((id) => {
      const suf = id.match(/_(\d+)$/)?.[1];
      return { id, label: suf ? `INV_${suf}` : id };
    });

    options.sort((a, b) => a.label.localeCompare(b.label));
    setDeviceOptions(options);
  }, [data]);

  useEffect(() => {
    if (selectedDevice !== "ALL" && !deviceOptions.find((opt) => opt.id === selectedDevice)) {
      setSelectedDevice("ALL");
    }
  }, [deviceOptions, selectedDevice]);

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

  const showNonComm = false;
  const nonCommMessage = "";

  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return [];

    const series: any[] = [];

    Object.keys(widgetData).forEach((deviceId) => {
      if (selectedDevice !== "ALL" && deviceId !== selectedDevice) return;

      const pts = widgetData[deviceId]?.[DC_VOLTAGE_ALIAS];
      if (!pts?.length) return;

      const suf = deviceId.match(/_(\d+)$/)?.[1] || deviceId;
      const colorIndex = !isNaN(Number(suf)) ? (parseInt(suf, 10) - 1) % 10 : series.length % 10;

      series.push({
        type: "spline",
        name: `${DC_VOLTAGE_ALIAS}-${suf}`,
        data: pts.map((p) => [p.ts, p.value]),
        marker: { enabled: false },
        boostThreshold: 1,
        turboThreshold: 50000,
        color: ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#a855f7", "#ec4899"][colorIndex],
      });
    });

    return series;
  }, [data, selectedDevice]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%" justifyContent="space-between" flexWrap="nowrap">
          <Box display="flex" alignItems="center" gap={3} minW={0} flex="1" flexShrink={1}>
            <Box minW={0} flex="1" overflow="hidden">
              <WidgetTitle noOfLines={1} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                DC Voltage
              </WidgetTitle>
            </Box>
            <Box flexShrink={0}>
              <NonCommunicationIndicator status={showNonComm} message={nonCommMessage} />
            </Box>
            <Box flexShrink={0}>
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
                <option value="ALL">ALL</option>
                {deviceOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </Box>
          </Box>

          <Box
            ml={dateFormatterMargin}
            opacity={isToday ? 0.4 : 1}
            pointerEvents={isToday ? "none" : "auto"}
            display="flex"
            alignItems="center"
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="6px"
            px={2}
            height="22px"
            gap={2}
          >
            <Box cursor="pointer" fontSize="12px" onClick={goPrevDay}>
              ‹
            </Box>
            <Box fontSize="12px" fontWeight="600" minW="100px" textAlign="center">
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
      width={["540px"]}
      height="314px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SpineGraph
        key={selectedDevice}
        apiData={seriesForChart}
        height={250}
        onExportReady={setExportFunctions}
        props={{
          chart: {
            events: {
              mouseOut: function (this: any) {
                this.series.forEach((s: any) => {
                  s.setState("", true);
                });
              },
            },
          },
          plotOptions: {
            series: {
              shadow: false,
              lineWidth: 2,
              states: {
                inactive: {
                  opacity: 1,
                },
                hover: {
                  enabled: true,
                  lineWidth: 2,
                },
              },
              marker: {
                enabled: true,
                radius: 4,
                lineWidth: 2,
                lineColor: "#FFFFFF",
              },
            },
          },
          yAxis: {
            tickAmount: 6,
            title: { text: null },
            labels: { style: { color: textColor } },
            gridLineColor: gridColor,
          },
          xAxis: {
            type: "datetime",
            crosshair: {
              color: "rgba(255,255,255,0.15)",
              width: 1,
            },
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
            tickInterval: 60 * 60 * 2 * 1000,
            min: !manualChanges ? undefined : new Date(new Date().setHours(4, 0, 0, 0)).getTime(),
            max: !manualChanges ? undefined : new Date(new Date().setHours(20, 0, 0, 0)).getTime(),
          },
          tooltip: {
            shared: true,
            hideDelay: 0,
            backgroundColor: useColorModeValue("#fff", "rgba(24,24,27,0.95)"),
            style: { color: textColor },
            valueDecimals: 2,
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: {
              color: textColor,
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default DCVoltageChart;
