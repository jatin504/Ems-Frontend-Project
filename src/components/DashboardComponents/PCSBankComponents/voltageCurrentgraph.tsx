import React, { useEffect, useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import WidgetTitle from "../../Common/WidgetTitle";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

import type { ExportFunctions } from "../../../types/graphExport/export";

const VOLTAGE = "Voltage";
const CURRENT = "Current";

interface VoltageCurrentGraphProps {
  selectedDevice: string;
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

const VoltageCurrentGraph: React.FC<VoltageCurrentGraphProps> = ({
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

  /*
   * SAME TIMEWINDOW AS SOC
   */
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
        relativeType: "currentDaySoFar",
        interval: 1,
        intervalType: "minute",
      },
    }
  );

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  /*
   * DATA FETCH
   */
  useEffect(() => {
    if (!selectedDevice) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedDevice],
      },

      keys: [
        {
          key: "voltage",
          alias: VOLTAGE,
          keyType: "common",
        },
        {
          key: "current",
          alias: CURRENT,
          keyType: "common",
        },
      ],

      aggregation: timeWindow.aggregation,

      timeRange: timeWindow.timeRange,

      orderBy: "ASC",
    } as any);
  }, [timeWindow, selectedDevice]);

  /*
   * FIXED UTC AXIS RANGE
   *
   * X-axis:
   * 08:00 UTC → 20:00 UTC
   *
   * Current time ke baad future blank rahega.
   */
  const today = new Date();

  const startTime = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    8,
    0,
    0,
    0
  );

  const endTime = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    20,
    0,
    0,
    0
  );

  /*
   * API DATA → CHART SERIES
   *
   * IMPORTANT:
   * Sirf fixed axis range ke andar ka data map hoga.
   * Isse line maxTime ke baad extend nahi hogi.
   */
  const seriesForChart = useMemo(() => {
    const widgetData = data as any;

    if (!widgetData || !selectedDevice) return [];

    const device = widgetData[selectedDevice];

    if (!device) return [];

    const voltage = device?.[VOLTAGE] ?? [];
    const current = device?.[CURRENT] ?? [];

    console.log("================================");
    console.log("VoltageCurrent API Data:", data);
    console.log("Selected Device:", selectedDevice);
    console.log("Voltage Points:", voltage);
    console.log("Current Points:", current);

    const series: any[] = [];

    /*
     * VOLTAGE MAPPING
     */
    if (voltage.length) {
      series.push({
        name: "Voltage",

        type: "spline",

        color: "#3B82F6",

        yAxis: 0,

        marker: {
          enabled: false,
        },

        lineWidth: 2,

        /*
         * Raw API timestamp direct use.
         * Koi +5:30 / -offset conversion nahi.
         *
         * Sirf fixed UTC range ke andar ka data.
         */
        data: voltage
          .map((p: any) => [
            Number(p.ts),
            Number(p.value),
          ])
          .filter(
            ([ts]: [number, number]) =>
              ts >= startTime && ts <= endTime
          ),
      });
    }

    /*
     * CURRENT MAPPING
     */
    if (current.length) {
      series.push({
        name: "Current",

        type: "spline",

        color: "#22C55E",

        yAxis: 1,

        marker: {
          enabled: false,
        },

        lineWidth: 2,

        /*
         * Raw API timestamp direct use.
         * Koi +5:30 / -offset conversion nahi.
         *
         * Sirf fixed UTC range ke andar ka data.
         */
        data: current
          .map((p: any) => [
            Number(p.ts),
            Number(p.value),
          ])
          .filter(
            ([ts]: [number, number]) =>
              ts >= startTime && ts <= endTime
          ),
      });
    }

    return series;
  }, [data, selectedDevice, startTime, endTime]);

  return (
    <GraphLayout
      title={
        <WidgetTitle>
          Voltage & Current Trend
        </WidgetTitle>
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
        apiData={seriesForChart}
        height={230}
        onExportReady={setExportFunctions}
        props={{
          /*
           * FIXED X-AXIS
           *
           * Ab x-axis current data ke according
           * chhota nahi hoga.
           */
          xAxis: {
            type: "datetime",

            min: startTime,

            max: endTime,

            startOnTick: false,

            endOnTick: false,

            minPadding: 0,

            maxPadding: 0,

            tickInterval: 60 * 60 * 1000,

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
          },

          /*
           * Y-AXIS
           */
          yAxis: [
            {
              title: {
                text: "Voltage (V)",
              },

              opposite: false,

              labels: {
                formatter(this: any) {
                  return `${this.value}`;
                },

                style: {
                  color: subTextColor,
                },
              },

              gridLineColor: gridColor,
            },

            {
              title: {
                text: "Current (A)",
              },

              opposite: true,

              labels: {
                formatter(this: any) {
                  return `${this.value}`;
                },

                style: {
                  color: subTextColor,
                },
              },

              gridLineColor: gridColor,
            },
          ],

          /*
           * UTC TOOLTIP
           *
           * "UTC" text intentionally removed.
           */
          tooltip: {
            shared: true,

            formatter: function (this: any) {
              const time = formatUTCTime(Number(this.x));

              let s = `<b>${time}</b><br/>`;

              this.points.forEach((p: any) => {
                const unit =
                  p.series.name === "Voltage"
                    ? " V"
                    : " A";

                s += `
                  <span style="color:${p.color}">●</span>
                  ${p.series.name} :
                  <b>${Number(p.y).toFixed(2)}${unit}</b><br/>
                `;
              });

              return s;
            },
          },

          /*
           * LEGEND
           */
          legend: {
            enabled: true,

            align: "center",

            verticalAlign: "bottom",

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

export default VoltageCurrentGraph;