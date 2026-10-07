import React, { useEffect, useMemo, useRef, useState } from "react";
import { useColorModeValue, Box } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import WidgetTitle from "../../Common/WidgetTitle";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

import type { ExportFunctions } from "../../../types/graphExport/export";
import useDateFormatterMargin from "../../DateFormatter";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

interface SocGraphProps {
  selectedDevice: string;
}

const SOC_ALIAS = "SoC";

const COLORS = ["#22C55E"];

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

/*
 * UTC TIME FORMATTER
 *
 * API timestamp milliseconds mein hai.
 * UTC hours/minutes use karne se browser ka local
 * timezone apply nahi hota.
 *
 * Example:
 * 14:10 UTC → 14:10
 * 19:40 IST → 14:10 UTC
 */
const formatUTCTime = (timestamp: number) => {
  const date = new Date(timestamp);

  return [
    String(date.getUTCHours()).padStart(2, "0"),
    String(date.getUTCMinutes()).padStart(2, "0"),
  ].join(":");
};

const SocGraph: React.FC<SocGraphProps> = ({
  selectedDevice,
}) => {
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#64748B", "#94A3B8");

  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.16)",
    "rgba(255,255,255,0.06)"
  );

  const { data, fetchData } = useTimeseriesData();

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

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [dateNavEnabled, setDateNavEnabled] = useState(true);

  const dateFormatterMargin = useDateFormatterMargin({
    fullScreenMargin: "900",
    normalMargin: "28",
  });

  /*
   * TIMEWINDOW → NAVIGATOR SYNC
   */
  useEffect(() => {
    const tw = timeWindow.timeRange;

    if (tw.type === "absolute") {
      if (tw.startTs) {
        setCurrentDate(new Date(tw.startTs));
        setDateNavEnabled(true);
      }

      return;
    }

    if (tw.type === "relative") {
      if (tw.relativeType === "currentDaySoFar") {
        setCurrentDate(new Date());
        setDateNavEnabled(true);
        return;
      }

      if (tw.relativeType === "yesterday") {
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

  /*
   * DATE FORMAT
   */
  const formattedDate = useMemo(() => {
    const y = currentDate.getFullYear();

    const m = String(currentDate.getMonth() + 1).padStart(2, "0");

    const d = String(currentDate.getDate()).padStart(2, "0");

    return `${y}/${m}/${d}`;
  }, [currentDate]);

  /*
   * TODAY CHECK
   */
  const isToday = useMemo(() => {
    const t = new Date();

    return (
      currentDate.getFullYear() === t.getFullYear() &&
      currentDate.getMonth() === t.getMonth() &&
      currentDate.getDate() === t.getDate()
    );
  }, [currentDate]);

  /*
   * ABSOLUTE DAY
   */
  const applyAbsoluteDay = (date: Date) => {
    if (!dateNavEnabled) return;

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

  /*
   * PREVIOUS DAY
   */
  const goPrevDay = () => {
    if (!dateNavEnabled) return;

    setCurrentDate((prev) => {
      const d = new Date(prev);

      d.setDate(d.getDate() - 1);

      applyAbsoluteDay(d);

      return d;
    });
  };

  /*
   * NEXT DAY
   */
  const goNextDay = () => {
    if (!dateNavEnabled || isToday) return;

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

  /*
   * DATA SOURCE
   *
   * API key  : soc
   * UI alias : SoC
   */
  const buildDataSource = () => ({
    devices: {
      patterns: [],

      ids: selectedDevice ? [selectedDevice] : [],
    },

    keys: [
      {
        key: "soc",

        alias: SOC_ALIAS,

        keyType: "common",

        type: "spline",
      },
    ],

    aggregation: timeWindowRef.current.aggregation,

    timeRange: timeWindowRef.current.timeRange,

    orderBy: "ASC",
  });

  /*
   * INITIAL FETCH + TIMEWINDOW CHANGE
   */
  useEffect(() => {
    if (!selectedDevice) return;

    fetchData(buildDataSource() as any);
  }, [selectedDevice, timeWindow]);

  /*
   * AUTO REFRESH
   */
  useEffect(() => {
    if (!selectedDevice) return;

    const { interval, intervalType } = timeWindow.timeRange;

    const refreshInterval = interval ?? 1;

    const refreshMs = intervalToMs(
      refreshInterval,
      intervalType ?? "minute"
    );

    const id = setInterval(() => {
      fetchData(buildDataSource() as any);
    }, refreshMs);

    return () => clearInterval(id);
  }, [
    selectedDevice,
    timeWindow.timeRange.interval,
    timeWindow.timeRange.intervalType,
  ]);

  /*
   * API DATA → CHART SERIES
   */
  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;

    if (!widgetData || !selectedDevice) return [];

    const device = widgetData[selectedDevice];

    if (!device) return [];

    const points = device[SOC_ALIAS] ?? [];

    console.log("================================");
    console.log("SoC API Data:", data);
    console.log("Selected Device:", selectedDevice);
    console.log("SoC Points:", points);

    if (!points.length) return [];

    return [
      {
        name: "SoC",

        type: "spline",

        color: COLORS[0],

        lineWidth: 2.5,

        marker: {
          enabled: false,
        },

        /*
         * Raw API timestamp direct use.
         * Koi +5:30 / -offset conversion nahi.
         */
        data: points.map((p) => [
          Number(p.ts),

          Number(p.value),
        ]),
      },
    ];
  }, [data, selectedDevice]);

  /*
   * AXIS RANGE
   */
  const offset = new Date().getTimezoneOffset() * 60000;

  const startTime = useMemo(() => {
    if (!manualChanges) return undefined;

    return new Date(
      new Date().setHours(4, 0, 0, 0) - offset
    ).getTime();
  }, [manualChanges, offset]);

  const endTime = useMemo(() => {
    if (!manualChanges) return undefined;

    return new Date(
      new Date().setHours(20, 0, 0, 0) - offset
    ).getTime();
  }, [manualChanges, offset]);

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">
          {/* LEFT */}
          <Box display="flex" alignItems="center" gap={3}>
            <WidgetTitle color={textColor}>
              SoC Trend
            </WidgetTitle>
          </Box>

          {/* DATE NAVIGATOR */}
          <Box
            ml={dateFormatterMargin}
            opacity={dateNavEnabled ? 1 : 0.4}
            pointerEvents={dateNavEnabled ? "auto" : "none"}
            display="flex"
            alignItems="center"
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="6px"
            px={2}
            height="22px"
            gap={2}
          >
            <Box
              cursor="pointer"
              fontSize="12px"
              onClick={goPrevDay}
            >
              ‹
            </Box>

            <Box
              fontSize="12px"
              fontWeight="600"
              minW="100px"
              textAlign="center"
            >
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
      height="300px"
      fullScreen
      timeWindow
      downloadOption
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
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

              lineWidth: 2.5,

              states: {
                inactive: {
                  opacity: 1,
                },

                hover: {
                  enabled: true,

                  lineWidth: 2.5,
                },
              },

              marker: {
                enabled: false,
              },
            },
          },

          xAxis: {
            type: "datetime",

            crosshair: {
              color: "rgba(255,255,255,0.15)",

              width: 1,
            },

            /*
             * UTC X-AXIS LABELS
             *
             * UTC time show hoga,
             * lekin "UTC" text nahi.
             */
            labels: {
              formatter: function (this: any) {
                return formatUTCTime(Number(this.value));
              },

              style: {
                color: subTextColor,
              },
            },

            lineColor: axisLineColor,

            gridLineColor: gridColor,

            gridLineDashStyle: "ShortDot",

            gridLineWidth: 1,

            tickInterval: 60 * 60 * 2 * 1000,

            min: startTime,

            max: endTime,
          },

          yAxis: {
            min: 0,

            max: 100,

            tickInterval: 20,

            title: {
              text: "SoC (%)",
            },

            labels: {
              style: {
                color: subTextColor,
              },

              formatter(this: any) {
                return `${this.value}`;
              },
            },

            gridLineColor: gridColor,
          },

          /*
           * UTC TOOLTIP
           *
           * "UTC" text intentionally removed.
           */
          tooltip: {
            shared: true,

            hideDelay: 0,

            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),

            style: {
              color: textColor,
            },

            formatter: function (this: any) {
              const time = formatUTCTime(Number(this.x));

              return `
                <b>${time}</b><br/>

                <span style="color:${this.points[0].color}">
                  ●
                </span>

                SoC :

                <b>
                  ${Number(this.points[0].y).toFixed(2)} %
                </b>
              `;
            },
          },

          legend: {
            enabled: true,

            align: "center",

            verticalAlign: "bottom",

            layout: "horizontal",

            itemStyle: {
              color: textColor,

              fontSize: "11px",
            },
          },

          credits: {
            enabled: false,
          },

          exporting: {
            enabled: false,
          },
        }}
      />
    </GraphLayout>
  );
};

export default SocGraph;