import React, { useMemo, useState } from "react";
import {
  Box,
  HStack,
  Select,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";

import type { ExportFunctions } from "../../../types/graphExport/export";

const hour = 60 * 60 * 1000;
const start = Date.UTC(2026, 6, 1);

const LoadForecastVsTarget = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const [range, setRange] = useState("24 Hours");

  const [resolution, setResolution] =
    useState("1 Hour");

  const actualLoad = useMemo(
    () => [
      [start + hour * 0, 4.2],
      [start + hour * 1, 4.8],
      [start + hour * 2, 5.3],
      [start + hour * 3, 5.9],
      [start + hour * 4, 6.4],
      [start + hour * 5, 7.0],
      [start + hour * 6, 7.6],
      [start + hour * 7, 8.0],
      [start + hour * 8, 8.3],
      [start + hour * 9, 8.5],
      [start + hour * 10, 8.1],
      [start + hour * 11, 7.8],
    ],
    []
  );

  const forecastLoad = useMemo(
    () => [
      [start + hour * 11, 7.8],
      [start + hour * 12, 7.9],
      [start + hour * 13, 8.2],
      [start + hour * 14, 8.6],
      [start + hour * 15, 9.0],
      [start + hour * 16, 9.3],
      [start + hour * 17, 9.5],
      [start + hour * 18, 9.2],
      [start + hour * 19, 8.8],
      [start + hour * 20, 8.3],
      [start + hour * 21, 7.7],
      [start + hour * 22, 7.1],
      [start + hour * 23, 6.5],
      [start + hour * 24, 6.0],
    ],
    []
  );

  const targetLoad = useMemo(
    () => [
      [start + hour * 11, 7.8],
      [start + hour * 12, 7.5],
      [start + hour * 13, 7.4],
      [start + hour * 14, 7.3],
      [start + hour * 15, 7.4],
      [start + hour * 16, 7.8],
      [start + hour * 17, 8.0],
      [start + hour * 18, 7.9],
      [start + hour * 19, 7.5],
      [start + hour * 20, 7.0],
      [start + hour * 21, 6.5],
      [start + hour * 22, 6.1],
      [start + hour * 23, 5.8],
      [start + hour * 24, 5.5],
    ],
    []
  );

  const withoutDSM = useMemo(
    () => [
      [start + hour * 11, 7.8],
      [start + hour * 12, 8.4],
      [start + hour * 13, 8.9],
      [start + hour * 14, 9.5],
      [start + hour * 15, 10.1],
      [start + hour * 16, 10.7],
      [start + hour * 17, 11.0],
      [start + hour * 18, 10.8],
      [start + hour * 19, 10.2],
      [start + hour * 20, 9.6],
      [start + hour * 21, 9.0],
      [start + hour * 22, 8.5],
      [start + hour * 23, 8.0],
      [start + hour * 24, 7.4],
    ],
    []
  );

  const seriesForChart = useMemo(
    () => [
      {
        type: "spline",
        name: "Actual Load",
        color: "#2563EB",
        data: actualLoad,
        marker: {
          enabled: false,
        },
      },

      {
        type: "spline",
        name: "Forecasted Load",
        color: "#60A5FA",
        dashStyle: "Dash",
        data: forecastLoad,
        marker: {
          enabled: false,
        },
      },

      {
        type: "spline",
        name: "Target Load (DSM)",
        color: "#22C55E",
        data: targetLoad,
        marker: {
          enabled: false,
        },
      },

      {
        type: "spline",
        name: "Forecast without DSM",
        color: "#EF4444",
        dashStyle: "Dash",
        data: withoutDSM,
        marker: {
          enabled: false,
        },
      },
    ],
    [
      actualLoad,
      forecastLoad,
      targetLoad,
      withoutDSM,
    ]
  );

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");

  const subTextColor = useColorModeValue(
    "#4A5568",
    "#B9B9B9"
  );

  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.16)",
    "rgba(255,255,255,0.06)"
  );
    return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">
          <Box fontWeight="600">
            Load Forecast vs Target (Next 24 Hours)
          </Box>

          <HStack ml="auto" mr="-8px" spacing={2}>
            <Select
              size="xs"
              w="100px"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option>24 Hours</option>
              <option>48 Hours</option>
              <option>7 Days</option>
            </Select>

            <Select
              size="xs"
              w="90px"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
            >
              <option>1 Hour</option>
              <option>30 Min</option>
              <option>15 Min</option>
            </Select>
          </HStack>
        </Box>
      }
      width={["100%"]}
      height="430px"
      mt="0"
      fullScreen
      onExport={exportFunctions}
    >
      <Box h="210px" w="100%">
        <SplineGraph
          apiData={seriesForChart}
          height={320}
          onExportReady={setExportFunctions}
          showLegendButtons={false}
          props={{
          chart: {
            zoomType: "x",
          },

          xAxis: {
            type: "datetime",
            tickInterval: 2 * hour,
            labels: {
              style: {
                color: subTextColor,
              },
            },
            lineColor: axisLineColor,
            gridLineColor: gridColor,

            plotLines: [
              {
                value: start + hour * 11,
                color: "#94A3B8",
                dashStyle: "Dash",
                width: 2,
                zIndex: 5,
                label: {
                  text: "Now",
                  rotation: 0,
                  y: -10,
                  style: {
                    color: textColor,
                    fontWeight: "600",
                  },
                },
              },
            ],
          },

          yAxis: {
            title: {
              text: "Load (MW)",
            },
            min: 0,
            max: 12,
            tickAmount: 6,
            labels: {
              style: {
                color: textColor,
              },
            },
            gridLineColor: gridColor,
          },

          tooltip: {
            shared: true,
            valueSuffix: " MW",
          },

          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
          },
        }}
      />
      </Box>

      <Box
        mt="108px"
        mx={4}
        borderRadius="10px"
        border="1px solid"
        borderColor={useColorModeValue("#E2E8F0", "#1E3A4C")}
        bg={useColorModeValue("#FFFFFF", "#0B2236")}
      >
        <HStack h="52px" spacing={0}>
          <Box flex={1} textAlign="center">
            <Text
              fontSize="11px"
              color={useColorModeValue("#64748B", "#94A3B8")}
            >
              Potential Reduction
            </Text>

            <Text
              mt="2px"
              fontSize="20px"
              fontWeight="700"
              color={useColorModeValue("#0F172A", "#F8FAFC")}
            >
              1.85 <Text as="span" fontSize="14px">MW</Text>
            </Text>
          </Box>

          <Box
            w="1px"
            h="34px"
            bg={useColorModeValue("#E2E8F0", "#1E3A4C")}
          />

          <Box flex={1} textAlign="center">
            <Text
              fontSize="11px"
              color={useColorModeValue("#64748B", "#94A3B8")}
            >
              Reduction Achieved
            </Text>

            <HStack justify="center" spacing={1}>
              <Text
                fontSize="20px"
                fontWeight="700"
                color={useColorModeValue("#0F172A", "#F8FAFC")}
              >
                1.35 <Text as="span" fontSize="14px">MW</Text>
              </Text>

              <Text
                mt="3px"
                fontSize="12px"
                color="#94A3B8"
              >
                (73%)
              </Text>
            </HStack>
          </Box>

          <Box
            w="1px"
            h="34px"
            bg={useColorModeValue("#E2E8F0", "#1E3A4C")}
          />

          <Box flex={1} textAlign="center">
            <Text
              fontSize="11px"
              color={useColorModeValue("#64748B", "#94A3B8")}
            >
              Remaining Opportunity
            </Text>

            <Text
              mt="2px"
              fontSize="20px"
              fontWeight="700"
              color={useColorModeValue("#0F172A", "#F8FAFC")}
            >
              0.50 <Text as="span" fontSize="14px">MW</Text>
            </Text>
          </Box>
        </HStack>
      </Box>
    </GraphLayout>
  );
};

export default LoadForecastVsTarget;