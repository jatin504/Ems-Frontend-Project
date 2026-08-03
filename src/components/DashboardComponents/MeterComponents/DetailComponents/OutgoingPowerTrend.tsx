import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useDateFormatterMargin from "../../../DateFormatter";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";

import type { ExportFunctions } from "../../../../types/graphExport/export";

type Props = {
  selectedMeter?: string;
};

const OutgoingPowerTrend = ({
  selectedMeter,
}: Props) => {

  const {
    config: timeWindowPowerTrend,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "none",
    [1, "minutes"],
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

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const formattedDate =
    useMemo(() => {

      const y =
        currentDate.getFullYear();

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

  const applyAbsoluteDay = (
    date: Date
  ) => {

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
        timeWindowPowerTrend.aggregation,

      orderBy:
        timeWindowPowerTrend.orderBy,

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

    setCurrentDate((prev) => {

      const d = new Date(prev);

      d.setDate(
        d.getDate() - 1
      );

      applyAbsoluteDay(d);

      return d;

    });

  };

  const goNextDay = () => {

    if (isToday) return;

    setCurrentDate((prev) => {

      const d = new Date(prev);

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

      if (reachedToday) {

        handleReset();

      } else {

        applyAbsoluteDay(d);

      }

      return d;

    });

  };

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: [],
        ids: selectedMeter
          ? [selectedMeter]
          : [],
      },

      keys: [
        {
          key:
            "total_active_power",
          alias:
            "Active Power (kW)",
          keyType:
            "timeseries",
        },

        {
          key:
            "total_reactive_power",
          alias:
            "Reactive Power (kvar)",
          keyType:
            "timeseries",
        },

        {
          key:
            "total_apparent_power",
          alias:
            "Apparent Power (kVA)",
          keyType:
            "timeseries",
        },
      ],

      aggregation:
        timeWindowPowerTrend.aggregation,

      timeRange:
        timeWindowPowerTrend.timeRange,

      orderBy:
        "ASC" as const,
    },
  };

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  useEffect(() => {

    if (!selectedMeter)
      return;

    

    fetchData(
      fetchingToServerObj.dataSource
    );

  }, [
    timeWindowPowerTrend,
    selectedMeter,
  ]);

  const seriesForChart =
    useMemo(() => {

      if (
        data &&
        typeof data === "object"
      ) {

        const series: any[] = [];

        Object.values(data).forEach(
          (deviceObj: any) => {

            if (
              deviceObj &&
              typeof deviceObj ===
                "object"
            ) {

              Object.entries(
                deviceObj
              ).forEach(
                ([
                  metric,
                  points,
                ]: any) => {

                  if (
                    Array.isArray(
                      points
                    )
                  ) {

                    series.push({
                      type:
                        "spline",

                      name:
                        metric,

                      data:
                        points.map(
                          (
                            p: any
                          ) => [
                            p.ts,
                            Number(
                              p.value
                            ),
                          ]
                        ),

                      marker: {
                        enabled: false,
                      },
                    });

                  }

                }
              );

            }

          }
        );

        return series;

      }

      return [];

    }, [data]);

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

  const [
    exportFunctions,
    setExportFunctions,
  ] =
    useState<ExportFunctions | null>(
      null
    );

  const dateFormatterMargin =
    useDateFormatterMargin({
      fullScreenMargin: "900",
      normalMargin: "28",
    });

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          alignItems="center"
          w="100%"
        >

          <Box fontWeight="600">
            Power Trend
          </Box>

          <Box
            ml={
              dateFormatterMargin
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
              fontSize="11px"
              fontWeight="600"
              minW="78px"
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

      width={["100%"]}

      height="343px"

      fullScreen

      timeWindow

      onTimeWindowChange={
        handleTimeWindowChange
      }

      onReset={handleReset}

      onExport={
        exportFunctions
      }
    >

      <SplineGraph
        apiData={
          seriesForChart
        }

        height={280}

        onExportReady={
          setExportFunctions
        }

        props={{
          chart: {
            events: {
              mouseOut:
                function (
                  this: any
                ) {

                  this.series.forEach(
                    (
                      s: any
                    ) => {

                      s.setState(
                        "",
                        true
                      );

                    }
                  );

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
                lineColor:
                  "#FFFFFF",
              },
            },
          },

          yAxis: {
            tickAmount: 6,

            title: {
              text: null,
            },

            labels: {
              style: {
                color:
                  textColor,
              },

              formatter(
                this: any
              ) {

                return (
                  this as any
                ).value.toFixed(
                  2
                );

              },
            },

            gridLineColor:
              gridColor,
          },

          xAxis: {
            type: "datetime",

            crosshair: {
              color:
                "rgba(255,255,255,0.15)",

              width: 1,
            },

            labels: {
              style: {
                color:
                  subTextColor,
              },
            },

            lineColor:
              axisLineColor,

            gridLineColor:
              gridColor,

            gridLineDashStyle:
              "ShortDot",

            gridLineWidth: 1,
          },

          tooltip: {
            shared: true,

            hideDelay: 0,

            backgroundColor:
              useColorModeValue(
                "#fff",
                "rgba(24,24,27,0.95)"
              ),

            style: {
              color:
                textColor,
            },

            valueDecimals: 2,
          },

          legend: {
            align: "center",

            verticalAlign:
              "bottom",

            layout:
              "horizontal",

            itemStyle: {
              color:
                textColor,
            },
          },
        }}
      />

    </GraphLayout>
  );
};

export default OutgoingPowerTrend;