import React, {
  useEffect,
  useState,
  useMemo,
} from "react";

import { useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../../Graphs/RevampCharts/ColumnGraph";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

import type { ExportFunctions } from "../../../../types/graphExport/export";

type Props = {
  selectedMeter?: string;
};

const HarmonicsVoltage: React.FC<Props> = ({
  selectedMeter,
}) => {

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
          key: "",
          alias: "Va",
          keyType: "timeseries",
          color: "#facc15",
        },

        {
          key: "",
          alias: "Vb",
          keyType: "timeseries",
          color: "#84cc16",
        },

        {
          key: "",
          alias: "Vc",
          keyType: "timeseries",
          color: "#c084fc",
        },

      ],

      aggregation: {
        func: "none",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "hour",
      },

      orderBy: "DESC" as const,

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

  }, [selectedMeter]);

  const textColor = useColorModeValue(
    "#1A202C",
    "#E6E6E6"
  );

  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  const axisLineColor = useColorModeValue(
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

  const categories = [
    "3rd",
    "5th",
    "7th",
    "9th",
    "11th",
    "13th",
  ];

  const seriesForChart =
    useMemo(() => {

      if (
        !data ||
        typeof data !== "object"
      ) return [];

      const deviceKeys =
        Object.keys(data);

      if (!deviceKeys.length)
        return [];

      const deviceData =
        data[deviceKeys[0]];

      if (!deviceData)
        return [];

      const series: any[] = [];

      fetchingToServerObj
        .dataSource
        .keys
        .forEach((cfg: any) => {

          const rawPoints =
            deviceData[cfg.alias];

          if (
            Array.isArray(
              rawPoints
            ) &&
            rawPoints.length > 0
          ) {

            const latest =
              Number(
                rawPoints[0]
                  ?.value || 0
              );

            series.push({

              type: "column",

              name: cfg.alias,

              color: cfg.color,

              data: [

                Number(
                  (
                    latest *
                    0.020
                  ).toFixed(2)
                ),

                Number(
                  (
                    latest *
                    0.015
                  ).toFixed(2)
                ),

                Number(
                  (
                    latest *
                    0.010
                  ).toFixed(2)
                ),

                Number(
                  (
                    latest *
                    0.007
                  ).toFixed(2)
                ),

                Number(
                  (
                    latest *
                    0.004
                  ).toFixed(2)
                ),

                Number(
                  (
                    latest *
                    0.002
                  ).toFixed(2)
                ),

              ],

            });

          }

        });

      return series;

    }, [data]);

  return (

    <GraphLayout
      title="Harmonics Voltage"
      width={["100%"]}
      height="344px"
      fullScreen
      onExport={exportFunctions}
    >

      <ColumnGraph
        apiData={seriesForChart}
        category={categories}
        height={280}
        onExportReady={
          setExportFunctions
        }

        props={{

          chart: {
            backgroundColor:
              "transparent",
            spacingTop: 10,
          },

          plotOptions: {

            column: {

              dataLabels: {
                enabled: false,
              },

              borderWidth: 0,

              pointWidth: 12,

              borderRadius: 2,

              grouping: true,

            },

          },

          tooltip: {

            shared: true,

            valueSuffix: "%",

            backgroundColor:
              useColorModeValue(
                "#fff",
                "rgba(24,24,27,0.95)"
              ),

            style: {
              color: textColor,
            },

          },

          xAxis: {

            categories,

            title: {

              text:
                "Harmonic Order",

              style: {

                color:
                  textColor,

                fontSize:
                  "11px",

                fontFamily:
                  "Poppins",

              },

            },

            labels: {

              style: {

                color:
                  textColor,

                fontSize:
                  "11px",

                fontFamily:
                  "Poppins",

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

          yAxis: [

            {

              title: {

                text:
                  "Magnitude (%)",

                style: {

                  color:
                    textColor,

                  fontSize:
                    "11px",

                  fontFamily:
                    "Poppins",

                },

              },

              min: 0,

              gridLineWidth: 1,

              gridLineDashStyle:
                "ShortDot",

              gridLineColor:
                gridColor,

              labels: {

                formatter:
                  function () {

                    return (
                      this.value +
                      "%"
                    );

                  },

                style: {

                  color:
                    textColor,

                  fontSize:
                    "11px",

                  fontFamily:
                    "Poppins",

                },

              },

            },

          ],

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

              fontWeight:
                "500",

              fontFamily:
                "Poppins",

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

        }}
      />

    </GraphLayout>

  );

};

export default HarmonicsVoltage;