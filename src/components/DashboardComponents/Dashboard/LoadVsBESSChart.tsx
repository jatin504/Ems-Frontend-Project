import React, { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../Graphs/RevampCharts/ColumnGraph";

import type { ExportFunctions } from "../../../types/graphExport/export";

const hour = 60 * 60 * 1000;
const start = Date.UTC(2026, 6, 15, 0, 0, 0);

const series = [
  {
    type: "spline",
    name: "Load Forecast",
    color: "#3B82F6",
    marker: {
      enabled: false,
    },
    data: [
      [start + 0 * hour, 6.5],
      [start + 2 * hour, 8.2],
      [start + 4 * hour, 9.1],
      [start + 6 * hour, 8.0],
      [start + 8 * hour, 6.9],
      [start + 10 * hour, 7.5],
      [start + 12 * hour, 9.8],
      [start + 14 * hour, 10.5],
      [start + 16 * hour, 9.2],
      [start + 18 * hour, 7.8],
      [start + 20 * hour, 6.6],
      [start + 22 * hour, 5.4],
      [start + 24 * hour, 4.8],
    ],
  },

  {
    type: "column",
    name: "Charge",
    color: "#22C55E",
    data: [
      [start + 1 * hour, 2.0],
      [start + 2 * hour, 3.5],
      [start + 3 * hour, 4.2],
      [start + 4 * hour, 5.0],
      [start + 5 * hour, 4.5],
      [start + 6 * hour, 3.8],
      [start + 7 * hour, 2.8],
    ],
  },

  {
    type: "column",
    name: "Discharge",
    color: "#F59E0B",
    data: [
      [start + 13 * hour, -0.8],
      [start + 14 * hour, -1.5],
      [start + 15 * hour, -2.6],
      [start + 16 * hour, -3.8],
      [start + 17 * hour, -4.7],
      [start + 18 * hour, -4.2],
      [start + 19 * hour, -3.5],
      [start + 20 * hour, -2.8],
      [start + 21 * hour, -2.1],
      [start + 22 * hour, -1.4],
    ],
  },
];

const LoadVsBESSChart = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");

  const gridColor = useColorModeValue(
    "rgba(0,0,0,.10)",
    "rgba(255,255,255,.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,.16)",
    "rgba(255,255,255,.06)"
  );

  const options = useMemo(
    () => ({
      plotOptions: {
        column: {
          borderWidth: 0,
          pointWidth: 14,
          borderRadius: 4,
        },
      },

      tooltip: {
        shared: true,
        backgroundColor: useColorModeValue(
          "#fff",
          "rgba(24,24,27,.95)"
        ),
        style: {
          color: textColor,
        },
      },

      xAxis: {
        type: "datetime",

        labels: {
          style: {
            color: textColor,
            fontSize: "11px",
          },
        },

        lineColor: axisLineColor,

        gridLineWidth: 1,
        gridLineDashStyle: "ShortDot",
        gridLineColor: gridColor,
      },

      yAxis: {
        title: {
          text: "",
        },

        min: -5,
        max: 12,
        tickInterval: 2,

        labels: {
          style: {
            color: textColor,
            fontSize: "11px",
          },
        },

        gridLineWidth: 1,
        gridLineDashStyle: "ShortDot",
        gridLineColor: gridColor,
      },

      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "bottom",
        y: 10,
        margin: 8,
        itemMarginTop: 2,
        itemMarginBottom: 2,

        itemStyle: {
          color: textColor,
          fontSize: "12px",
        },
      },
    }),
    [textColor]
  );

  return (
    <GraphLayout
      title="Load vs BESS Schedule"
      width={["460px"]}
      height="320px"
      fullScreen
      onExport={exportFunctions}
    >
              <>
        <ColumnGraph
          apiData={series}
          height={190}
          legendHeight={30}
          props={options}
          onExportReady={setExportFunctions}
          showLegendButtons={false}
        />

        <Flex
          mt={2}
          pt={3}
          pb={1}
          borderTop="1px solid"
          borderColor={useColorModeValue(
            "rgba(0,0,0,.08)",
            "rgba(255,255,255,.08)"
          )}
          justify="space-between"
          align="center"
        >
          <Box lineHeight="1.1">
            <Text
              fontSize="11px"
              color="gray.500"
              lineHeight="1"
            >
              Total Charge
            </Text>

            <Text
              mt={1}
              fontSize="14px"
              lineHeight="1"
              fontWeight="700"
              color="#22C55E"
            >
              7.42 MWh
            </Text>
          </Box>

          <Box lineHeight="1.1">
            <Text
              fontSize="11px"
              color="gray.500"
              lineHeight="1"
            >
              Total Discharge
            </Text>

            <Text
              mt={1}
              fontSize="14px"
              lineHeight="1"
              fontWeight="700"
              color="#F59E0B"
            >
              8.90 MWh
            </Text>
          </Box>

          <Box textAlign="right" lineHeight="1.1">
            <Text
              fontSize="11px"
              color="gray.500"
              lineHeight="1"
            >
              Net Discharge
            </Text>

            <Text
              mt={1}
              fontSize="14px"
              lineHeight="1"
              fontWeight="700"
              color={textColor}
            >
              1.48 MWh
            </Text>
          </Box>
        </Flex>
      </>
    </GraphLayout>
  );
};

export default LoadVsBESSChart;