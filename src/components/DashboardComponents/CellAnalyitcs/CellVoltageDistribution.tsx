import React, { useMemo, useState } from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnChart from "../../Graphs/RevampCharts/ColumnGraph";

const CellVoltageDistribution = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0");
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#1E293B");
  const tooltipTextColor = useColorModeValue("#1A202C", "#F8FAFC");

  const xCategories = [
    "3.330",
    "3.335",
    "3.340",
    "3.345",
    "3.350",
    "3.355",
    "3.360",
    "3.365",
    "3.370",
  ];

  const chartData = useMemo(() => {
    const values = [
      4, 8, 15, 22, 38, 55, 70, 92, 118,
      142, 165, 138, 112, 82, 58, 36, 24,
      15, 8,
    ];

    return values.map((v, i) => {
      let color = "#2563EB"; // Blue

      if (i >= 3 && i <= 5)
        color = "#38BDF8";

      if (i >= 6 && i <= 11)
        color = "#65A30D";

      if (i >= 12 && i <= 14)
        color = "#FACC15";

      if (i >= 15 && i <= 16)
        color = "#F97316";

      if (i >= 17)
        color = "#DC2626";

      return {
        x: i,
        y: v,
        color,
      };
    });
  }, []);

  return (
    <GraphLayout
      title="Cell Voltage Distribution"
      titleLengthSVG={118}
      titleLengthLongSVG={1680}
      width={["460px"]}
      height="100%"
      fullScreen
      timeWindow={false}
      mt="2"
    >
      <VStack
        spacing={2}
        h="100%"
        align="stretch"
      >
        <Box
          flex="1"
          minH="180px"
        >
          <ColumnChart
            height={200}
            apiData={[
              {
                name: "Voltage",
                data: chartData,
              },
            ]}
            isFullscreen={isFullscreen}
            onFullscreenChange={setIsFullscreen}
            props={{
              xAxis: {
                categories: chartData.map((_, i) =>
                  (
                    3.330 +
                    i * 0.002
                  ).toFixed(3)
                ),

                title: {
                  text: "Voltage (V)",
                },

                labels: {
                  style: {
                    color: axisLabelColor,
                    fontSize: "8px",
                  },
                },
              },

              yAxis: {
                title: {
                  text: "No. of Cells",
                },

                min: 0,
                max: 180,
                tickInterval: 20,

                labels: {
                  style: {
                    color: axisLabelColor,
                    fontSize: "8px",
                  },
                },
              },
                            tooltip: {
                backgroundColor: tooltipBgColor,
                style: {
                  color: tooltipTextColor,
                  fontSize: "11px",
                },

                formatter: function (this: any) {
                  return `
                    <b>Voltage Range</b><br/>
                    ${this.x} V<br/>
                    <b>No. of Cells : ${this.y}</b>
                  `;
                },
              },

              plotOptions: {
                column: {
                  borderRadius: 2,
                  pointPadding: 0.08,
                  groupPadding: 0.05,
                  borderWidth: 0,
                },
                series: {
                  animation: false,
                },
              },

              legend: {
                enabled: false,
              },
            }}
          />
        </Box>

        {/* Bottom Legend */}

        <HStack
          justify="space-between"
          mt={1}
          px={2}
          wrap="wrap"
        >
          <HStack spacing={1}>
            <Box
              w="10px"
              h="10px"
              bg="#2563EB"
              borderRadius="2px"
            />
            <Text fontSize="10px">
              Low (&lt;3.345V)
            </Text>
          </HStack>

          <HStack spacing={1}>
            <Box
              w="10px"
              h="10px"
              bg="#65A30D"
              borderRadius="2px"
            />
            <Text fontSize="10px">
              Normal (3.345–3.360V)
            </Text>
          </HStack>

          <HStack spacing={1}>
            <Box
              w="10px"
              h="10px"
              bg="#DC2626"
              borderRadius="2px"
            />
            <Text fontSize="10px">
              High (&gt;3.360V)
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </GraphLayout>
  );
};

export default CellVoltageDistribution;