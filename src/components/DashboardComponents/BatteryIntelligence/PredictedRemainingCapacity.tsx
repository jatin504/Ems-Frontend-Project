import React, { useMemo, useState } from "react";
import { Box, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";

import type { ExportFunctions } from "../../../types/graphExport/export";

const start = Date.UTC(2024, 0, 1);
const year = 365 * 24 * 60 * 60 * 1000;

const PredictedRemainingCapacity = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const borderColor = useColorModeValue("#D9E2EC", "#1E3345");

  const sohTable = [
    { year: "2026", soh: "92.4 %" },
    { year: "2028", soh: "86.7 %" },
    { year: "2030", soh: "79.8 %" },
    { year: "2032", soh: "73.1 %" },
    { year: "2034", soh: "66.4 %" },
    { year: "2035", soh: "62.2 %", danger: true },
  ];

  const series = useMemo(
    () => [
      {
        type: "spline",
        name: "Historical",
        color: "#84CC16",
        lineWidth: 3,
        marker: { enabled: false },
        data: [
          [start + year * 0, 100],
          [start + year * 1, 99],
          [start + year * 2, 98],
        ],
      },

      {
        type: "spline",
        name: "Prediction",
        color: "#38BDF8",
        dashStyle: "Dash",
        marker: { enabled: false },
        data: [
          [start + year * 2, 98],
          [start + year * 4, 93],
          [start + year * 6, 87],
          [start + year * 8, 81],
        ],
      },

      {
        type: "spline",
        name: "Lower Bound",
        color: "#D946EF",
        dashStyle: "Dash",
        marker: { enabled: false },
        data: [
          [start + year * 2, 98],
          [start + year * 4, 89],
          [start + year * 6, 74],
          [start + year * 8, 55],
        ],
      },

      {
        type: "spline",
        name: "Upper Bound",
        color: "#A1A1AA",
        dashStyle: "Dash",
        marker: { enabled: false },
        data: [
          [start + year * 2, 98],
          [start + year * 4, 95],
          [start + year * 6, 89],
          [start + year * 8, 68],
        ],
      },
    ],
    []
  );

  const options = useMemo(
    () => ({
      chart: {
        spacingTop: 10,
        spacingBottom: 20,
      },

      credits: {
        enabled: false,
      },

      legend: {
        enabled: true,
      },

      xAxis: {
        type: "datetime",
      },

      yAxis: {
        min: 50,
        max: 100,
        title: {
          text: null,
        },
      },
            tooltip: {
        shared: true,
        valueSuffix: " %",
      },
    }),
    []
  );

  return (
    <GraphLayout
      title="Predicted Remaining Capacity"
      width={["100%"]}
      height="100%"
      onExport={exportFunctions}
      fullScreen
    >
      <HStack
        spacing={3}
        align="stretch"
        h="250px"
      >
        {/* Chart */}
        <Box flex="1">
          <SplineGraph
            apiData={series}
            props={options}
            height={220}
            showLegendButtons={false}
            onExportReady={setExportFunctions}
          />
        </Box>

        {/* Right Table */}
        <Box
          w="92px"
          h="190px"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="8px"
          px={2}
          py={2}
          flexShrink={0}
          display="flex"
          flexDirection="column"
        >
          <Text
            fontSize="10px"
            fontWeight="700"
            textAlign="center"
            mb={2}
          >
            Projected SOH
          </Text>

          <VStack
            spacing={0.5}
            align="stretch"
            flex={1}
            justify="space-evenly"
          >
            {sohTable.map((item) => (
              <HStack
                key={item.year}
                justify="space-between"
              >
                <Text
                  fontSize="11px"
                  color={item.danger ? "#EF4444" : "inherit"}
                  fontWeight={item.danger ? "700" : "500"}
                >
                  {item.year}
                </Text>

                <Text
                  fontSize="11px"
                  color={item.danger ? "#EF4444" : "inherit"}
                  fontWeight={item.danger ? "700" : "500"}
                >
                  {item.soh}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </HStack>
    </GraphLayout>
  );
};

export default PredictedRemainingCapacity;