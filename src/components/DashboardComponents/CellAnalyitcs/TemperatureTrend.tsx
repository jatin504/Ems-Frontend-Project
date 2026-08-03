import React, { useMemo, useState } from "react";
import {
  Box,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";

import type { ExportFunctions } from "../../../types/graphExport/export";

const hour = 60 * 60 * 1000;
const start = Date.UTC(2026, 6, 1);

const TemperatureTrend = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const temperatureData = useMemo(
    () => [
      [start + hour * 0, 40.5],
      [start + hour * 1, 42.8],
      [start + hour * 2, 44.1],
      [start + hour * 3, 45.3],
      [start + hour * 4, 46.2],
      [start + hour * 5, 47.0],
      [start + hour * 6, 46.8],
      [start + hour * 7, 47.6],
      [start + hour * 8, 47.4],
      [start + hour * 9, 47.9],
      [start + hour * 10, 47.8],
      [start + hour * 11, 48.1],
      [start + hour * 12, 48.4],
      [start + hour * 13, 48.8],
      [start + hour * 14, 47.9],
      [start + hour * 15, 46.3],
      [start + hour * 16, 44.5],
      [start + hour * 17, 43.1],
      [start + hour * 18, 42.0],
      [start + hour * 19, 41.6],
      [start + hour * 20, 41.9],
      [start + hour * 21, 42.5],
      [start + hour * 22, 43.2],
      [start + hour * 23, 43.8],
    ],
    []
  );

  const series = useMemo(
    () => [
      {
        type: "spline",
        name: "Temperature",
        color: "#EF4444",
        data: temperatureData,
        marker: {
          enabled: false,
        },
      },
    ],
    [temperatureData]
  );

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");

  const subTextColor = useColorModeValue(
    "#64748B",
    "#94A3B8"
  );

  const gridColor = useColorModeValue(
    "rgba(0,0,0,.08)",
    "rgba(255,255,255,.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,.16)",
    "rgba(255,255,255,.08)"
  );
  return (
  <GraphLayout
    title={
      <Box display="flex" alignItems="center" w="100%">
        <Text fontSize="18px" fontWeight="600">
          Temperature Trend
        </Text>
      </Box>
    }
    width={["100%"]}
    height="220px"
    mt={0}
    fullScreen
    onExport={exportFunctions}
  >
    <SplineGraph
      apiData={series}
      height={170}
      onExportReady={setExportFunctions}
      showLegendButtons={false}
      props={{
        chart: {
          backgroundColor: "transparent",
        },

        xAxis: {
          type: "datetime",
          tickInterval: 4 * hour,

          labels: {
            format: "{value:%H:%M}",
            style: {
              color: subTextColor,
            },
          },

          lineColor: axisLineColor,
          tickColor: axisLineColor,
          gridLineColor: gridColor,
        },

        yAxis: {
          min: 20,
          max: 60,
          tickPositions: [20, 30, 40, 50, 60],

          title: {
            text: "Temperature (°C)",
            style: {
              color: textColor,
            },
          },

          labels: {
            style: {
              color: textColor,
            },
            formatter: function () {
              return `${this.value}°`;
            },
          },

          gridLineColor: gridColor,
        },

        tooltip: {
          shared: true,
          valueSuffix: " °C",
          valueDecimals: 2,
        },

        legend: {
          enabled: false,
        },

        plotOptions: {
          spline: {
            lineWidth: 2,
            marker: {
              enabled: false,
            },
          },
        },

        annotations: [
          {
            labels: [
              {
                point: {
                  x: start + hour * 12,
                  y: 48.8,
                  xAxis: 0,
                  yAxis: 0,
                },
                text:
                  "<span style='color:#EF4444;font-weight:600'>Max 44.83 °C</span>",
                borderWidth: 0,
                backgroundColor: "transparent",
              },
              {
                point: {
                  x: start + hour * 18,
                  y: 31.5,
                  xAxis: 0,
                  yAxis: 0,
                },
                text:
                  "<span style='color:#60A5FA;font-weight:600'>Min 32.10 °C</span>",
                borderWidth: 0,
                backgroundColor: "transparent",
              },
            ],
          },
        ],
      }}
    />
  </GraphLayout>
);
};

export default TemperatureTrend;