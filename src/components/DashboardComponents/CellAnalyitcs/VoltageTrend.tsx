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

const VoltageTrend = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const voltageData = useMemo(
    () => [
      [start + hour * 0, 3.381],
      [start + hour * 1, 3.388],
      [start + hour * 2, 3.392],
      [start + hour * 3, 3.396],
      [start + hour * 4, 3.398],
      [start + hour * 5, 3.397],
      [start + hour * 6, 3.399],
      [start + hour * 7, 3.398],
      [start + hour * 8, 3.399],
      [start + hour * 9, 3.400],
      [start + hour * 10, 3.399],
      [start + hour * 11, 3.398],
      [start + hour * 12, 3.397],
      [start + hour * 13, 3.396],
      [start + hour * 14, 3.394],
      [start + hour * 15, 3.393],
      [start + hour * 16, 3.391],
      [start + hour * 17, 3.389],
      [start + hour * 18, 3.388],
      [start + hour * 19, 3.390],
      [start + hour * 20, 3.392],
      [start + hour * 21, 3.394],
      [start + hour * 22, 3.396],
      [start + hour * 23, 3.398],
    ],
    []
  );

  const series = useMemo(
    () => [
      {
        type: "spline",
        name: "Voltage",
        color: "#EF4444",
        data: voltageData,
        marker: {
          enabled: false,
        },
      },
    ],
    [voltageData]
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
        <Text fontWeight="600">
          Voltage Trend
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
      height={190}
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
          gridLineColor: gridColor,
        },

        yAxis: {
          min: 3.30,
          max: 3.42,
          tickAmount: 6,

          title: {
            text: "Voltage (V)",
            style: {
              color: textColor,
            },
          },

          labels: {
            style: {
              color: textColor,
            },
            formatter: function () {
              return Number(this.value).toFixed(2);
            },
          },

          gridLineColor: gridColor,
        },

        tooltip: {
          shared: true,
          valueSuffix: " V",
          valueDecimals: 3,
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
      }}
    />
  </GraphLayout>
);
};

export default VoltageTrend;