// PerformanceCard.tsx

import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface Props {
  title?: string;
  value?: string;
  unit?: string;
  color?: string;
  isChart?: boolean;
  deviceId?: string;
}

const PerformanceCard = ({
  title,
  value,
  unit,
  color,
  isChart,
  deviceId,
}: Props) => {

  const { colorMode } =
    useColorMode();

  const isDark =
    colorMode === "dark";

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

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  /* ================= CHART API ================= */

  useEffect(() => {

    if (
      !deviceId ||
      !isChart
    ) return;

    const fetchChartData =
      () => {

        fetchData({

          devices: {
            patterns: [],
            ids: [deviceId],
          },

          keys: [

            {
              key: "inv_pr",
              alias: "actual_pr",
              keyType: "common",
            },

            {
              key: "expected_pr",
              alias: "expected_pr",
              keyType: "common",
            },

            {
              key: "estimated_pr",
              alias: "estimated_pr",
              keyType: "common",
            },

          ],

          aggregation: {

            func: "last",

            interval: 7,

            intervalType:
              "Days",
          },

          timeRange: {

            type: "relative",

            relativeType:
              "currentDaySoFar",
          },

          orderBy: "ASC",

        } as any);

      };

    fetchChartData();

    const interval =
      setInterval(() => {

        fetchChartData();

      }, 60000);

    return () =>
      clearInterval(interval);

  }, [deviceId, isChart]);

  /* ================= SERIES MAP ================= */

  const {
    series,
    categories,
  } = useMemo(() => {

    if (
      !data ||
      !deviceId ||
      !(data as any)[deviceId]
    ) {

      return {
        series: [],
        categories: [],
      };
    }

    const d =
      (data as any)[deviceId];

    const actualPoints =
      [...(d["actual_pr"] || [])]
        .sort(
          (a: any, b: any) =>
            a.ts - b.ts
        );

    const expectedPoints =
      [...(d["expected_pr"] || [])]
        .sort(
          (a: any, b: any) =>
            a.ts - b.ts
        );

    const estimatedPoints =
      [...(d["estimated_pr"] || [])]
        .sort(
          (a: any, b: any) =>
            a.ts - b.ts
        );

    const categories =
      actualPoints.map(
        (p: any) => {

          const d =
            new Date(p.ts);

          return d.toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
            }
          );

        }
      );

    return {

      categories,

      series: [

        {
          type: "column",

          name: "ACTUAL (%)",

          color: "#2563EB",

          data:
            actualPoints.map(
              (p: any) =>
                Number(p.value)
            ),
        },

        {
          type: "column",

          name: "EXPECTED (%)",

          color: "#84cc16",

          data:
            expectedPoints.map(
              (p: any) =>
                Number(p.value)
            ),
        },

        {
          type: "column",

          name: "ESTIMATED (%)",

          color: "#A1A1AA",

          data:
            estimatedPoints.map(
              (p: any) =>
                Number(p.value)
            ),
        },

      ],

    };

  }, [data, deviceId]);

  /* ================= CHART CARD ================= */

  if (isChart) {

    return (

      <GraphLayout
        title={
          <Text
            fontWeight="700"
            fontSize="14px"
            color={
              isDark
                ? "#ffffff"
                : "#0f172a"
            }
          >
            Performance
          </Text>
        }
        width={["100%"]}
        height="250px"
        fullScreen
        timeWindow={false}
      >

        <ColumnGraph
          apiData={series}
          category={categories}
          height={195}
          onExportReady={() => {}}
          props={{

            chart: {
              backgroundColor:
                "transparent",
            },

            plotOptions: {

              column: {

                borderWidth: 0,

                pointWidth: 12,

                borderRadius: 3,

                grouping: true,

                groupPadding: 0.28,

                pointPadding: 0.08,
              },
            },

            tooltip: {

              shared: true,

              backgroundColor:
                useColorModeValue(
                  "#fff",
                  "rgba(24,24,27,0.95)"
                ),

              style: {
                color:
                  textColor,
              },
            },

            xAxis: {

              categories,

              labels: {

                style: {

                  color:
                    subTextColor,

                  fontSize:
                    "11px",
                },
              },

              lineColor:
                axisLineColor,

              gridLineWidth: 1,

              gridLineDashStyle:
                "ShortDot",

              gridLineColor:
                gridColor,
            },

            yAxis: {

              title: {
                text: null,
              },

              max: 100,

              tickPositions: [
                0,
                50,
                100,
              ],

              labels: {

                style: {

                  color:
                    textColor,

                  fontSize:
                    "11px",
                },

                formatter:
                  function () {

                    return (
                      this.value +
                      " %"
                    );
                  },
              },

              gridLineWidth: 1,

              gridLineDashStyle:
                "ShortDot",

              gridLineColor:
                gridColor,
            },

            legend: {

              enabled: true,

              align: "center",

              verticalAlign:
                "bottom",

              useHTML: true,

              itemStyle: {

                overflow:
                  "auto",

                color:
                  textColor,

                fontSize:
                  "12px",
              },

              labelFormatter:
                function (
                  this: any
                ) {

                  return (
                    '<span style="width:10px;height:10px;display:inline-block;background-color:' +
                    this.color +
                    ';border-radius:0;"></span> ' +
                    this.name
                  );
                },
            },

            navigator: {
              enabled: false,
            } as any,

            scrollbar: {
              enabled: false,
            } as any,

            rangeSelector: {
              enabled: false,
            } as any,

            credits: {
              enabled: false,
            },
          }}
        />

      </GraphLayout>
    );
  }

  /* ================= VALUE CARD ================= */

  return (

    <div
      style={{

        background: isDark
          ? "linear-gradient(90deg,#0a2744 0%, #081f37 45%, #06172d 100%)"
          : "linear-gradient(90deg,#ffffff 0%, #f7fafc 50%, #edf4fb 100%)",

        border: isDark
          ? "1px solid #16395c"
          : "1px solid #dbe7f3",

        borderRadius: "8px",

        padding:
          "18px 16px",

        height: "100%",

        display: "flex",

        flexDirection:
          "column",

        justifyContent:
          "center",

        position: "relative",

        overflow: "hidden",

        boxShadow: isDark
          ? "inset 0 0 35px rgba(0,0,0,0.16)"
          : "0 2px 10px rgba(15,23,42,0.04)",
      }}
    >

      <div
        style={{

          position: "absolute",

          right: 0,

          top: "18%",

          width: "1px",

          height: "64%",

          background: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(15,23,42,0.08)",
        }}
      />

      <div
        style={{

          fontSize: "13px",

          fontWeight: 500,

          color: isDark
            ? "#9BB3CC"
            : "#64748b",

          marginBottom: "16px",

          whiteSpace:
            "nowrap",
        }}
      >
        {title}
      </div>

      <div
        style={{

          display: "flex",

          alignItems:
            "baseline",

          gap: "6px",
        }}
      >

        <h2
          style={{

            margin: 0,

            color,

            fontSize: "22px",

            lineHeight: 1,

            fontWeight: 700,

            letterSpacing:
              "-0.5px",

            textShadow: isDark
              ? `0 0 12px ${color}33`
              : "none",
          }}
        >
          {value}
        </h2>

        <span
          style={{

            color: isDark
              ? "#dbeafe"
              : "#475569",

            fontSize: "13px",

            fontWeight: 600,
          }}
        >
          {unit}
        </span>

      </div>

    </div>
  );
};

export default PerformanceCard;