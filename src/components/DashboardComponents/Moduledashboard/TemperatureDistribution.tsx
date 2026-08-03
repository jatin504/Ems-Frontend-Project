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

const TemperatureDistribution = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0");
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#2D3748");
  const tooltipTextColor = useColorModeValue("#1A202C", "#F7FAFC");

  const chartData = useMemo(() => {
    const values = [
      36.9, 36.8, 35.6, 36.4, 36.2,
      35.8, 36.7, 35.5, 35.4, 35.2,
      35.1, 35.8, 37.2, 36.6, 37.0,
      35.9, 36.1, 36.4, 40.8, 35.3,
      35.2, 35.5, 44.83, 35.7, 36.9,
    ];

    return values.map((v, i) => ({
      y: v,
      color:
        v > 50
          ? "#EF4444"
          : v >= 40
          ? "#F59E0B"
          : "#65A30D",
      x: i,
    }));
  }, []);

  return (
    <GraphLayout
      title="Temperature Distribution"
      titleLengthSVG={110}
      titleLengthLongSVG={1680}
      width={["550px"]}
      height="100%"
      fullScreen
      timeWindow={false}
      mt="2"
    >
      <VStack
        w="100%"
        h="100%"
        spacing={2}
        align="stretch"
      >
        <Box
          w="100%"
          flex="1"
          minH="220px"
        >
          <ColumnChart
            height={220}
            apiData={[
              {
                name: "Temperature",
                data: chartData,
              },
            ]}
            isFullscreen={isFullscreen}
            onFullscreenChange={setIsFullscreen}
            props={{
              xAxis: {
                categories: Array.from(
                  { length: 25 },
                  (_, i) => `${i + 1}`
                ),
                title: {
                  text: "Cell Index",
                },
                labels: {
                  style: {
                    color: axisLabelColor,
                    fontSize: "8px",
                  },
                },
              },

              yAxis: {
                title: null,
                min: 20,
                max: 70,
                gridLineWidth: 1,
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
                    <b>Cell ${this.point.x + 1}</b><br/>
                    Temperature :
                    <b>${this.point.y.toFixed(2)} °C</b>
                  `;
                },
              },

              plotOptions: {
                column: {
                  borderRadius: 3,
                  pointPadding: 0.15,
                  groupPadding: 0.08,
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

        {/* Legend */}
        <HStack
          justify="center"
          spacing={8}
          mt={1}
        >
          <HStack spacing={2}>
            <Box
              w="12px"
              h="12px"
              bg="#65A30D"
              borderRadius="2px"
            />
            <Text fontSize="12px">
              Normal (&le;40°C)
            </Text>
          </HStack>

          <HStack spacing={2}>
            <Box
              w="12px"
              h="12px"
              bg="#F59E0B"
              borderRadius="2px"
            />
            <Text fontSize="12px">
              Warning (40-50°C)
            </Text>
          </HStack>

          <HStack spacing={2}>
            <Box
              w="12px"
              h="12px"
              bg="#EF4444"
              borderRadius="2px"
            />
            <Text fontSize="12px">
              Alarm (&gt;50°C)
            </Text>
          </HStack>
        </HStack>

        {/* Footer */}
        <HStack
          justify="space-between"
          px={2}
          mt={2}
        >
          <Text fontSize="13px">
            Max:
            <Text
              as="span"
              color="#EF4444"
              fontWeight="700"
            >
              {" "}44.83 °C
            </Text>
          </Text>

          <Text fontSize="13px">
            Min:
            <Text
              as="span"
              color="#38BDF8"
              fontWeight="700"
            >
              {" "}36.87 °C
            </Text>
          </Text>

          <Text fontSize="13px">
            Avg:
            <Text
              as="span"
              color="#D946EF"
              fontWeight="700"
            >
              {" "}40.85 °C
            </Text>
          </Text>
        </HStack>

      </VStack>
    </GraphLayout>
  );
};

export default TemperatureDistribution;