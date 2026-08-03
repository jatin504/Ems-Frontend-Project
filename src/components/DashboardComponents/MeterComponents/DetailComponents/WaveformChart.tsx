import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

import type { ExportFunctions } from "../../../../types/graphExport/export";

type Props = {
  selectedMeter?: string;
};

const WaveformChart = ({
  selectedMeter,
}: Props) => {

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  useEffect(() => {

    if (!selectedMeter)
      return;

    fetchData({

      devices: {
        patterns: [],
        ids: [selectedMeter],
      },

      keys: [

        // VOLTAGE

        {
          key:
            "voltage_ln_r",

          alias:
            "Vr",

          keyType:
            "timeseries",
        },

        {
          key:
            "voltage_ln_y",

          alias:
            "Vy",

          keyType:
            "timeseries",
        },

        {
          key:
            "voltage_ln_b",

          alias:
            "Vb",

          keyType:
            "timeseries",
        },

        // CURRENT

        {
          key:
            "current_r",

          alias:
            "Ir",

          keyType:
            "timeseries",
        },

        {
          key:
            "current_y",

          alias:
            "Iy",

          keyType:
            "timeseries",
        },

        {
          key:
            "current_b",

          alias:
            "Ib",

          keyType:
            "timeseries",
        },

      ],

      aggregation: {
        func: "none",
        interval: 1,
        intervalType:
          "minute",
      },

      timeRange: {
        type: "relative",
        relativeType:
          "currentDaySoFar",
        interval: 1,
        intervalType:
          "minute",
      },

      orderBy:
        "ASC",

    } as any);

  }, [selectedMeter]);

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

  /* ================= SERIES (map actual timeseries into datetime series) ================= */

  const seriesForChart =
    useMemo(() => {

      if (!data || typeof data !== "object") {
        return [];
      }

      const deviceKeys = Object.keys(data);

      if (!deviceKeys.length) return [];

      const deviceData = data[deviceKeys[0]];

      const mapToSeries = (
        alias: string,
        name: string,
        color: string,
        yAxisIndex: number
      ) => {
        const points = (deviceData?.[alias] || [])
          .map((p: any) => {
            const ts = Number(p?.ts) || 0;
            const v = Number(p?.value) || 0;
            return [ts, v];
          })
          // ensure sorted by ts
          .sort((a: any, b: any) => a[0] - b[0]);

        return {
          type: "spline",
          name,
          color,
          yAxis: yAxisIndex,
          data: points,
          marker: { enabled: false },
        };
      };

      return [
        mapToSeries("Vr", "Vr", "#00c2ff", 0),
        mapToSeries("Vy", "Vy", "#84cc16", 0),
        mapToSeries("Vb", "Vb", "#c084fc", 0),
        mapToSeries("Ir", "Ir", "#f97316", 1),
        mapToSeries("Iy", "Iy", "#eab308", 1),
        mapToSeries("Ib", "Ib", "#ef4444", 1),
      ];

    }, [data]);

  const [
    exportFunctions,
    setExportFunctions,
  ] =
    useState<ExportFunctions | null>(
      null
    );

  return (

    <GraphLayout
      title="Voltage & Current"
      width={["100%"]}
      height="344px"
      fullScreen
      onExport={exportFunctions}
    >

      <SplineGraph
        apiData={seriesForChart}
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

              shadow:
                false,

              lineWidth:
                2,

              states: {

                inactive: {
                  opacity: 1,
                },

                hover: {

                  enabled:
                    true,

                  lineWidth:
                    2,

                },

              },

              marker: {
                enabled:
                  false,
              },

            },

          },

          yAxis: [

            /* LEFT SIDE -> VOLTAGE */

            {

              title: {
                text: "",
                style: {
                  color: textColor,
                },
              },

              labels: {

                style: {
                  color: textColor,
                },

                formatter: function () {

                  return this.value + " V";

                },

              },

              tickAmount: 6,

              gridLineColor: gridColor,

            },

            /* RIGHT SIDE -> CURRENT */

            {

              title: {
                text: "",
                style: {
                  color: textColor,
                },
              },

              labels: {

                style: {
                  color: textColor,
                },

                formatter: function () {

                  return this.value + " A";

                },

              },

              tickAmount: 6,

              opposite: true,

              gridLineWidth: 0,

            },

          ],

          xAxis: {

            type: "datetime",

            labels: {

              style: {
                color: subTextColor,
              },

            },

            lineColor: axisLineColor,

            gridLineColor: gridColor,

            gridLineDashStyle: "ShortDot",

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

export default WaveformChart;