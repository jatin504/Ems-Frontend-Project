import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";

import type {
  ExportFunctions,
} from "../../../types/graphExport/export";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

import {
  useTimeHandle,
} from "../../../Services/TimeWindowSetting";

import useDateFormatterMargin from "../../DateFormatter";

interface Props {
  id?: string | null;
}

export default function TemperatureTrendChart({
  id,
}: Props) {

  // =========================
  // EXPORT
  // =========================

  const [
    exportFunctions,
    setExportFunctions,
  ] =
    useState<ExportFunctions | null>(
      null
    );

  // =========================
  // DATE FORMATTER MARGIN
  // =========================

  const dateFormatterMargin =
    useDateFormatterMargin({
      fullScreenMargin: "900",
      normalMargin: "220px",
    });

  // =========================
  // TIME WINDOW
  // =========================

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "none",
    [1, "minute"],
    60000,
    {
      timeRange: {
        type: "relative",
        relativeType:
          "currentDaySoFar",
        interval: 1,
        intervalType: "minute",
      },
    }
  );

  const timeWindowRef =
    useRef(timeWindow);

  useEffect(() => {
    timeWindowRef.current =
      timeWindow;
  }, [timeWindow]);

  // =========================
  // DATE
  // =========================

  const [
    currentDate,
    setCurrentDate,
  ] = useState(new Date());

  const [
    dateNavEnabled,
    setDateNavEnabled,
  ] = useState(true);

  useEffect(() => {

    const tw =
      timeWindow.timeRange;

    if (
      tw.type === "absolute"
    ) {

      if (tw.startTs) {

        setCurrentDate(
          new Date(tw.startTs)
        );

        setDateNavEnabled(true);
      }

      return;
    }

    if (
      tw.type === "relative"
    ) {

      if (
        tw.relativeType ===
        "currentDaySoFar"
      ) {

        setCurrentDate(
          new Date()
        );

        setDateNavEnabled(true);

        return;
      }

      if (
        tw.relativeType ===
        "yesterday"
      ) {

        const d =
          new Date();

        d.setDate(
          d.getDate() - 1
        );

        setCurrentDate(d);

        setDateNavEnabled(true);

        return;
      }

      setDateNavEnabled(false);

      return;
    }

    if (
      tw.type === "last"
    ) {
      setDateNavEnabled(false);
    }

  }, [timeWindow]);

  const formattedDate =
    useMemo(() => {

      const y =
        currentDate.getFullYear();

      const m =
        String(
          currentDate.getMonth() + 1
        ).padStart(2, "0");

      const d =
        String(
          currentDate.getDate()
        ).padStart(2, "0");

      return `${y}/${m}/${d}`;

    }, [currentDate]);

  const isToday =
    useMemo(() => {

      const t =
        new Date();

      return (
        currentDate.getFullYear() ===
          t.getFullYear() &&

        currentDate.getMonth() ===
          t.getMonth() &&

        currentDate.getDate() ===
          t.getDate()
      );

    }, [currentDate]);

  // =========================
  // DATE NAV
  // =========================

  const applyAbsoluteDay = (
    date: Date
  ) => {

    if (!dateNavEnabled)
      return;

    const start =
      new Date(date);

    start.setHours(
      0,
      0,
      0,
      0
    );

    const end =
      new Date(date);

    end.setHours(
      23,
      59,
      59,
      999
    );

    handleTimeWindowChange({
      aggregation:
        timeWindowRef.current
          .aggregation,

      orderBy: "ASC",

      timeRange: {
        type: "absolute",
        startTs:
          start.getTime(),
        endTs:
          end.getTime(),
      },
    });
  };

  const goPrevDay = () => {

    if (!dateNavEnabled)
      return;

    setCurrentDate(
      (prev) => {

        const d =
          new Date(prev);

        d.setDate(
          d.getDate() - 1
        );

        applyAbsoluteDay(d);

        return d;
      }
    );
  };

  const goNextDay = () => {

    if (
      !dateNavEnabled ||
      isToday
    ) {
      return;
    }

    setCurrentDate(
      (prev) => {

        const d =
          new Date(prev);

        d.setDate(
          d.getDate() + 1
        );

        const today =
          new Date();

        const reachedToday =
          d.getFullYear() ===
            today.getFullYear() &&

          d.getMonth() ===
            today.getMonth() &&

          d.getDate() ===
            today.getDate();

        if (
          reachedToday
        ) {

          handleReset();

        } else {

          applyAbsoluteDay(
            d
          );
        }

        return d;
      }
    );
  };

  // =========================
  // API
  // =========================

  const {
    data,
    fetchData,
  } =
    useTimeseriesData();

  const buildDataSource =
    () => ({
      devices: {
        ids: id
          ? [id]
          : [],
        patterns: [],
      },

      keys: [

        {
          key: "oti",
          alias: "oti",
          keyType:
            "common",
        },

        {
          key: "wti",
          alias: "wti",
          keyType:
            "common",
        },

      ],

      aggregation:
        timeWindowRef.current
          .aggregation,

      timeRange:
        timeWindowRef.current
          .timeRange,

      orderBy: "ASC",
    });

  // =========================
  // API HIT
  // =========================

  const lastRequestKey =
    useRef<string | null>(
      null
    );

  useEffect(() => {

    if (!id) return;

    const ds =
      buildDataSource();

    const key =
      JSON.stringify(ds);

    if (
      lastRequestKey.current ===
      key
    ) {
      return;
    }

    lastRequestKey.current =
      key;

    fetchData(
      ds as any
    );

  }, [
    id,
    timeWindow.timeRange.type,
    timeWindow.timeRange.startTs,
    timeWindow.timeRange.endTs,
    timeWindow.timeRange.relativeType,
  ]);

  // =========================
  // REFRESH 1 MIN
  // =========================

  useEffect(() => {

    const intervalId =
      setInterval(() => {

        const ds =
          buildDataSource();

        const key =
          JSON.stringify(ds);

        if (
          lastRequestKey.current !==
          key
        ) {

          lastRequestKey.current =
            key;

          fetchData(
            ds as any
          );
        }

      }, 60000);

    return () =>
      clearInterval(
        intervalId
      );

  }, []);

  // =========================
  // DATA
  // =========================

  const deviceData =
    data?.[
      id || ""
    ] || {};

  const otiSeries =
    deviceData?.oti || [];

  const wtiSeries =
    deviceData?.wti || [];

  const seriesData = [

    {
      type: "spline",

      name: "OTI",

      data:
        otiSeries.map(
          (
            item: any
          ) => [
            item.ts,
            Number(
              item.value
            ),
          ]
        ),

      color:
        "#f45b5b",
    },

    {
      type: "spline",

      name: "WTI",

      data:
        wtiSeries.map(
          (
            item: any
          ) => [
            item.ts,
            Number(
              item.value
            ),
          ]
        ),

      color:
        "#7cb5ec",
    },

  ];

  // =========================
  // THEME
  // =========================

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

  const axisLineColor =
    useColorModeValue(
      "rgba(0,0,0,0.16)",
      "rgba(255,255,255,0.06)"
    );

  // =========================
  // UI
  // =========================

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          alignItems="center"
          w="100%"
        >
          <Box
            fontWeight="600"
          >
            Temperature Trend
          </Box>

          <Box
            ml={dateFormatterMargin}
            opacity={
              dateNavEnabled
                ? 1
                : 0.4
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
          >
            <Box
              cursor="pointer"
              fontSize="12px"
              onClick={
                goPrevDay
              }
            >
              ‹
            </Box>

            <Box
              fontSize="12px"
              fontWeight="600"
              minW="100px"
              textAlign="center"
            >
              {
                formattedDate
              }
            </Box>

            <Box
              cursor={
                isToday
                  ? "not-allowed"
                  : "pointer"
              }
              opacity={
                isToday
                  ? 0.35
                  : 1
              }
              fontSize="12px"
              onClick={
                goNextDay
              }
            >
              ›
            </Box>
          </Box>
        </Box>
      }

      width="920px"

      height="295px"

      fullScreen

      onExport={
        exportFunctions
      }

      timeWindow

      onTimeWindowChange={
        handleTimeWindowChange
      }

      onReset={
        handleReset
      }
    >
      <SpineGraph
        apiData={
          seriesData
        }

        height={220}

        onExportReady={
          setExportFunctions
        }

        props={{

          yAxis: {
            title: {
              text: "",
            },

            labels: {
              style: {
                color:
                  textColor,
                fontSize:
                  "10px",
              },
            },

            gridLineColor:
              gridColor,

            tickAmount: 6,
          },

          xAxis: {
            type:
              "datetime",

            labels: {
              style: {
                color:
                  subTextColor,
                fontSize:
                  "10px",
              },
            },

            lineColor:
              axisLineColor,

            gridLineColor:
              gridColor,

            gridLineDashStyle:
              "ShortDot",
          },

          legend: {
            align:
              "center",

            verticalAlign:
              "bottom",

            layout:
              "horizontal",

            itemStyle: {
              color:
                textColor,

              fontSize:
                "10px",
            },
          },

          tooltip: {
            shared: true,

            valueSuffix:
              " °C",

            backgroundColor:
              useColorModeValue(
                "#ffffff",
                "rgba(24,24,27,0.95)"
              ),

            style: {
              color:
                textColor,
            },
          },

        }}
      />
    </GraphLayout>
  );
}