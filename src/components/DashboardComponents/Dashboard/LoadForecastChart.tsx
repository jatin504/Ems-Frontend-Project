import { useMemo, useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { MdPsychology } from "react-icons/md";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";

import type { ExportFunctions } from "../../../types/graphExport/export";

const hour = 60 * 60 * 1000;

// Fixed date instead of Date.now()
const start = Date.UTC(2026, 6, 15, 0, 0, 0);

const LoadForecastChart = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const series = useMemo(
    () => [
      {
        type: "spline",
        name: "Actual",
        color: "#2E90FA",
        marker: { enabled: true },
        data: [
          [start + 0 * hour, 6.2],
          [start + 1 * hour, 6.8],
          [start + 2 * hour, 7.5],
          [start + 3 * hour, 8.2],
          [start + 4 * hour, 8.8],
          [start + 5 * hour, 8.0],
          [start + 6 * hour, 7.4],
          [start + 7 * hour, null],
        ],
      },

      {
        type: "spline",
        name: "Forecast",
        color: "#22C55E",
        marker: { enabled: true },
        data: [
          [start + 7 * hour, 7.3],
          [start + 8 * hour, 8.1],
          [start + 9 * hour, 9.0],
          [start + 10 * hour, 9.6],
          [start + 11 * hour, 9.2],
          [start + 12 * hour, 8.6],
          [start + 13 * hour, 7.9],
          [start + 14 * hour, 7.0],
        ],
      },

      {
        type: "spline",
        name: "Upper Bound",
        color: "#C026D3",
        marker: { enabled: false },
        data: [
          [start + 7 * hour, 8.5],
          [start + 8 * hour, 9.5],
          [start + 9 * hour, 10.5],
          [start + 10 * hour, 11.2],
          [start + 11 * hour, 10.8],
          [start + 12 * hour, 10.0],
          [start + 13 * hour, 9.3],
          [start + 14 * hour, 8.4],
        ],
      },

      {
        type: "spline",
        name: "Lower Bound",
        color: "#A855F7",
        marker: { enabled: false },
        data: [
          [start + 7 * hour, 6.1],
          [start + 8 * hour, 6.8],
          [start + 9 * hour, 7.5],
          [start + 10 * hour, 8.2],
          [start + 11 * hour, 7.9],
          [start + 12 * hour, 7.3],
          [start + 13 * hour, 6.8],
          [start + 14 * hour, 6.1],
        ],
      },
    ],
    []
  );

  const options = useMemo(
    () => ({
      xAxis: {
        type: "datetime",
      },

      yAxis: {
        min: 0,
        max: 12,
        title: {
          text: null,
        },
      },

      tooltip: {
        shared: true,
        valueDecimals: 2,
      },

      legend: {
        enabled: true,
        show: false,
      },
    }),
    []
  );

  return (
    <GraphLayout
      title="Load Forecast - Next 48 Hours"
      width={["820px"]}
      height="320px"
      fullScreen
      onExport={exportFunctions}
    >
      <Box position="relative" h="100%">
        <SplineGraph
          apiData={series}
          height={200}
          props={options}
          onExportReady={setExportFunctions}
          showLegendButtons={false}
        />

        <HStack
          position="absolute"
          bottom="34px"
          left="10px"
          right="10px"
          justify="space-between"
          borderTop="1px solid rgba(255,255,255,.08)"
          pt={3}
          pb={0}
          bg="transparent"
        >
          <VStack spacing={0} align="start">
            <Text fontSize="10px" color="gray.500">
              MAPE
            </Text>
            <Text fontWeight="600">4.32%</Text>
          </VStack>

          <VStack spacing={0} align="start">
            <Text fontSize="10px" color="gray.500">
              RMSE
            </Text>
            <Text fontWeight="600">0.41 MW</Text>
          </VStack>

          <VStack spacing={0} align="start">
            <Text fontSize="10px" color="gray.500">
              MAE
            </Text>
            <Text fontWeight="600">0.33 MW</Text>
          </VStack>

          <VStack spacing={0} align="start">
            <Text fontSize="10px" color="gray.500">
              R² Score
            </Text>
            <Text fontWeight="600">0.94</Text>
          </VStack>

          <HStack spacing={2}>
            <Icon as={MdPsychology} color="gray.500" />

            <VStack spacing={0} align="start">
              <Text fontSize="10px" color="gray.500">
                Model
              </Text>
              <Text fontWeight="600">LightGBM v2.3</Text>
            </VStack>
          </HStack>
        </HStack>
      </Box>
    </GraphLayout>
  );
};

export default LoadForecastChart;