// InverterPowerGraph.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useColorModeValue, Select, Box } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../types/graphExport/export";

/*TYPES */

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

/* CONSTANTS */

const POWER_ALIAS = "Power (kW)";

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

/*  interval → ms helper  */
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

/*  COMPONENT */

const InverterPowerGraph: React.FC = () => {
  /* TIME WINDOW */
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

  /* keep latest config  */
  const timeWindowRef = useRef(timeWindow);
  useEffect(() => {
    timeWindowRef.current = timeWindow;
  }, [timeWindow]);

  /* STATE */
  const [selectedDevice, setSelectedDevice] = useState<string>("ALL");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const { data, fetchData } = useTimeseriesData();

  /* DATASOURCE */
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

  /* FETCH ON TIME WINDOW CHANGE*/
  useEffect(() => {
    fetchData(buildDataSource() as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindow]);

  /*AUTO REFRESH (DYNAMIC INTERVAL) */
  useEffect(() => {
    const { interval, intervalType } = timeWindow.timeRange;

    const refreshMs = intervalToMs(interval, intervalType);

    const intervalId = setInterval(() => {
      fetchData(buildDataSource() as any);
    }, refreshMs);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    timeWindow.timeRange.interval,
    timeWindow.timeRange.intervalType,
  ]);

  /*DEVICE OPTIONS */
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

  /* RESET INVALID SELECTION */
  useEffect(() => {
    if (
      selectedDevice !== "ALL" &&
      !deviceOptions.find((d) => d.id === selectedDevice)
    ) {
      setSelectedDevice("ALL");
    }
  }, [deviceOptions, selectedDevice]);

  /* SERIES */
  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return [];

    const series: any[] = [];

    Object.keys(widgetData).forEach((deviceId) => {
      if (selectedDevice !== "ALL" && selectedDevice !== deviceId) return;

      const points = widgetData[deviceId]?.[POWER_ALIAS];
      if (!points?.length) return;

      const suffix = deviceId.match(/_(\d+)$/)?.[1];
      // Legend label: Power (kW)-1, Power (kW)-2, ...
      let legendNum = suffix ? suffix : undefined;
      if (!legendNum) {
        // fallback: try to extract any trailing number
        const fallbackNum = deviceId.match(/(\d+)(?!.*\d)/)?.[1];
        legendNum = fallbackNum || deviceId;
      }
      const colorIndex = legendNum && !isNaN(Number(legendNum))
        ? (parseInt(legendNum, 10) - 1) % COLORS.length
        : series.length % COLORS.length;

      series.push({
        type: "spline",
        name: `${POWER_ALIAS}-${legendNum}`,
        data: points.map((p) => [p.ts, p.value]),
        marker: { enabled: true },
        color: COLORS[colorIndex],
      });
    });

    return series;
  }, [data, selectedDevice]);

  /*THEME*/
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

  /* RENDER */

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <Box>Power</Box>

          <Select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            size="xs"
            minW="90px"
            height="24px"
            fontSize="11px"
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="4px"
            ml={2}
          >
            <option value="ALL">ALL</option>
            {deviceOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </Select>
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
        height={260}
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

export default InverterPowerGraph;
