import { useEffect, useMemo, useRef, useState } from "react";

import { Box, useColorModeValue } from "@chakra-ui/react";

import useDateFormatterMargin from "../../DateFormatter";

import { useTimeHandle } from "../../../Services/TimeWindowSetting";

import ScatterGraph from "../../Graphs/RevampCharts/ScatterGraph";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

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
  value: string;
  label: string;
}

type Props = {
  selectedDevice: string;
};

const VOLTAGE_ALIAS = "Voltage (V)";

const CURRENT_ALIAS = "Current (A)";

const intervalToMs = (
  interval: number,
  unit: string
) => {
  switch (unit) {
    case "second":
      return interval * 1000;

    case "minute":
      return interval * 60000;

    case "hour":
      return interval * 3600000;

    default:
      return 60000;
  }
};

const VICurveChart = ({
  selectedDevice,
}: Props) => {
  /* ================= TIME WINDOW ================= */

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "avg",
    [30, "minute"],
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

  const timeWindowRef =
    useRef(timeWindow);

  useEffect(() => {
    timeWindowRef.current = timeWindow;
  }, [timeWindow]);

  /* ================= STATES ================= */

  

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(
      null
    );

  /* ================= DATE ================= */

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [dateNavEnabled, setDateNavEnabled] =
    useState(true);

  /* ================= TIMEWINDOW DATE SYNC ================= */

  useEffect(() => {
    const tw = timeWindow.timeRange;

    if (tw.type === "absolute") {
      if (tw.startTs) {
        setCurrentDate(
          new Date(tw.startTs)
        );

        setDateNavEnabled(true);
      }

      return;
    }

    if (tw.type === "relative") {
      if (
        tw.relativeType ===
        "currentDaySoFar"
      ) {
        setCurrentDate(new Date());

        setDateNavEnabled(true);

        return;
      }

      if (
        tw.relativeType === "yesterday"
      ) {
        const d = new Date();

        d.setDate(d.getDate() - 1);

        setCurrentDate(d);

        setDateNavEnabled(true);

        return;
      }

      setDateNavEnabled(false);

      return;
    }

    if (tw.type === "last") {
      setDateNavEnabled(false);
    }
  }, [timeWindow]);

  /* ================= FORMAT DATE ================= */

  const formattedDate = useMemo(() => {
    const y = currentDate.getFullYear();

    const m = String(
      currentDate.getMonth() + 1
    ).padStart(2, "0");

    const d = String(
      currentDate.getDate()
    ).padStart(2, "0");

    return `${y}/${m}/${d}`;
  }, [currentDate]);

  const isToday = useMemo(() => {
    const t = new Date();

    return (
      currentDate.getFullYear() ===
        t.getFullYear() &&
      currentDate.getMonth() ===
        t.getMonth() &&
      currentDate.getDate() ===
        t.getDate()
    );
  }, [currentDate]);

  const dateMargin = useDateFormatterMargin();

  /* ================= DATE NAVIGATION ================= */

  const applyAbsoluteDay = (
    date: Date
  ) => {
    if (!dateNavEnabled) return;

    const start = new Date(date);

    start.setHours(0, 0, 0, 0);

    const end = new Date(date);

    end.setHours(23, 59, 59, 999);

    handleTimeWindowChange({
      aggregation:
        timeWindowRef.current.aggregation,

      orderBy: "ASC",

      timeRange: {
        type: "absolute",

        startTs: start.getTime(),

        endTs: end.getTime(),
      },
    });
  };

  const goPrevDay = () => {
    if (!dateNavEnabled) return;

    setCurrentDate((prev) => {
      const d = new Date(prev);

      d.setDate(d.getDate() - 1);

      applyAbsoluteDay(d);

      return d;
    });
  };

  const goNextDay = () => {
    if (!dateNavEnabled || isToday)
      return;

    setCurrentDate((prev) => {
      const d = new Date(prev);

      d.setDate(d.getDate() + 1);

      const today = new Date();

      const reachedToday =
        d.getFullYear() ===
          today.getFullYear() &&
        d.getMonth() ===
          today.getMonth() &&
        d.getDate() === today.getDate();

      if (reachedToday) {
        handleReset();
      } else {
        applyAbsoluteDay(d);
      }

      return d;
    });
  };

  /* ================= API ================= */

  const { data, fetchData } =
    useTimeseriesData();

  const buildDataSource = () => ({
    devices: {
      patterns: [
        "_inverter_inverter_",
      ],

      ids: [],
    },

    keys: [
      {
        key: "total_dc_voltage",

        alias: VOLTAGE_ALIAS,

        keyType: "common",

        type: "scatter",
      },

      {
        key: "total_dc_current",

        alias: CURRENT_ALIAS,

        keyType: "common",

        type: "scatter",
      },
    ],

    aggregation:
      timeWindowRef.current.aggregation,

    timeRange:
      timeWindowRef.current.timeRange,

    orderBy:
      timeWindowRef.current.orderBy,
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchData(
      buildDataSource() as any
    );
  }, [timeWindow]);

  /* ================= AUTO REFRESH ================= */

  useEffect(() => {
    const {
      interval,
      intervalType,
    } = timeWindow.timeRange;

    const refreshMs = intervalToMs(
      interval ?? 1,
      intervalType ?? "minute"
    );

    const id = setInterval(() => {
      fetchData(
        buildDataSource() as any
      );
    }, refreshMs);

    return () => clearInterval(id);
  }, [
    timeWindow.timeRange.interval,
    timeWindow.timeRange.intervalType,
  ]);

  /* device options removed — parent passes `selectedDevice` prop */

  /* ================= CHART SERIES ================= */

  const seriesForChart = useMemo(() => {
    const widgetData =
      data as WidgetData | null;

    if (!widgetData) return [];

    const series: any[] = [];

    Object.keys(widgetData).forEach(
      (deviceId) => {
        /* ⭐ SELECTED DEVICE FILTER */

        if (
          selectedDevice &&
          selectedDevice !== deviceId
        )
          return;

        const voltageArr =
          widgetData[deviceId]?.[
            VOLTAGE_ALIAS
          ];

        const currentArr =
          widgetData[deviceId]?.[
            CURRENT_ALIAS
          ];

        if (
          voltageArr &&
          currentArr
        ) {
          const len = Math.min(
            voltageArr.length,
            currentArr.length
          );

          const pts: any[] = [];

          for (
            let i = 0;
            i < len;
            i++
          ) {
            pts.push([
              Number(
                currentArr[i].value
              ),

              Number(
                voltageArr[i].value
              ),
            ]);
          }

          const suf =
            deviceId.match(
              /(\d+)$/
            )?.[0];

          series.push({
            type: "scatter",

            name: suf
              ? `Volt-Amps-${suf}`
              : "Volt-Amps",

            data: pts,

            marker: {
              enabled: true,
            },
          });
        }
      }
    );

    return series;
  }, [data, selectedDevice]);

  /* ================= COLORS ================= */

  const textColor =
    useColorModeValue(
      "#1A202C",
      "#E6E6E6"
    );

  const subTextColor =
    useColorModeValue(
      "#4A5568",
      "#B9B9B9"
    );

  const gridColor =
    useColorModeValue(
      "rgba(0,0,0,0.10)",
      "rgba(255,255,255,0.08)"
    );

  /* ================= UI ================= */

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          alignItems="center"
          w="100%"
          gap={3}
        >
          <Box fontWeight="600">
            VI Curve
          </Box>

          {/* Device selection handled by parent via `selectedDevice` prop */}

          {/* DATE NAVIGATOR */}

          <Box
            opacity={
              dateNavEnabled ? 1 : 0.4
            }
            pointerEvents={
              dateNavEnabled
                ? "auto"
                : "none"
            }
            display="flex"
            alignItems="center"
            bg={useColorModeValue(
              "gray.100",
              "gray.700"
            )}
            borderRadius="6px"
            px={2}
            height="22px"
            gap={2}
            ml="250px"
          >
            <Box
              cursor="pointer"
              fontSize="12px"
              onClick={goPrevDay}
            >
              ‹
            </Box>

            <Box
              fontSize="11px"
              fontWeight="600"
              minW={`${dateMargin}px`}
              textAlign="center"
            >
              {formattedDate}
            </Box>

            <Box
              cursor={
                isToday
                  ? "not-allowed"
                  : "pointer"
              }
              opacity={
                isToday ? 0.35 : 1
              }
              fontSize="12px"
              onClick={goNextDay}
            >
              ›
            </Box>
          </Box>
        </Box>
      }
      width={["100%"]}
      height="343px"
      fullScreen
      timeWindow
      onTimeWindowChange={
        handleTimeWindowChange
      }
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <ScatterGraph
        apiData={seriesForChart}
        height={280}
        onExportReady={
          setExportFunctions
        }
        props={{
          chart: {
            type: "scatter",
            zoomType: "xy",
          },

          yAxis: {
            title: {
              text: "Voltage (V)",

              style: {
                color: textColor,
              },
            },

            tickAmount: 6,

            labels: {
              style: {
                color: textColor,
              },
            },

            gridLineColor:
              gridColor,
          },

          xAxis: {
            title: {
              text: "Current (A)",

              style: {
                color: textColor,
              },
            },

            labels: {
              style: {
                color:
                  subTextColor,
              },
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default VICurveChart;