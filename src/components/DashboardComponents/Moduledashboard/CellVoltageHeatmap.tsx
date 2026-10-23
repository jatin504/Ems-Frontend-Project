import React, { useState } from "react";
import { Box, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import HeatmapChart from "../../Graphs/RevampCharts/Heatmapchart";

const CellVoltageHeatmap = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0");
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#2D3748");
  const tooltipTextColor = useColorModeValue("#1A202C", "#F7FAFC");

  const heatmapData = [
    {
      type: "heatmap",
      name: "Cell Voltage",
      borderWidth: 1,
      data: [] as [number, number, number][],
    },
  ];

  const xAxisCategories = [
    "00:00",
    "02:00",
    "04:00",
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
  ];

  const yAxisCategories = Array.from({ length: 25 }, (_, index) => `Cell-${index + 1}`);

  // Dummy Heatmap Data
  for (let y = 0; y < yAxisCategories.length; y++) {
    for (let x = 0; x < xAxisCategories.length; x++) {
      heatmapData[0].data.push([
        x,
        y,
        +(3.32 + Math.random() * 0.08).toFixed(3),
      ]);
    }
  }

  return (
    <GraphLayout
      title="Cell Voltage Heatmap"
      titleLengthSVG={90}
      titleLengthLongSVG={1680}
      width={["560px"]}
      height="630px"
      fullScreen
      onFullscreenChange={setIsFullscreen}
      contentProps={{ height: "calc(100% - 48px)", pb: 0, minH: 0 }}
      timeWindow={false}
      mt="2"
    >
      <VStack
        w="100%"
        h="100%"
        minH={0}
        spacing={2}
        align="stretch"
        bg={useColorModeValue("#F8FAFC", "#0F1720")}
        borderRadius="10px"
        p="8px"
      >
        <Box
          w="100%"
          flex="1"
          minH={0}
          p="4px"
        >
          <HeatmapChart
            fitContainer
            height={430}
            apiData={heatmapData}
            isFullscreen={isFullscreen}
            props={{
              xAxis: {
                type: "category",
                categories: xAxisCategories,
                labels: {
                  style: {
                    color: axisLabelColor,
                    fontSize: isFullscreen ? "12px" : "8px",
                  },
                },
              },

              yAxis: {
                title: null,
                categories: yAxisCategories,
                labels: {
                  style: {
                    color: axisLabelColor,
                    fontSize: isFullscreen ? "12px" : "8px",
                  },
                },
                gridLineWidth: 0,
              },
                            legend: {
                enabled: false,
              },

              tooltip: {
                backgroundColor: tooltipBgColor,
                style: {
                  color: tooltipTextColor,
                  fontSize: "11px",
                },
                formatter: function (this: any) {
                  return `
                    <b>${yAxisCategories[this.point.y]}</b><br/>
                    Time : ${xAxisCategories[this.point.x]}<br/>
                    Voltage : <b>${this.point.value} V</b>
                  `;
                },
              },

              colorAxis: {
                min: 3.340,
                max: 3.365,
                showInLegend: false,
                stops: [
                  [0, "#3E8E1A"],
                  [0.45, "#8BC34A"],
                  [0.65, "#F6C000"],
                  [0.82, "#FF7A00"],
                  [1, "#D7191C"],
                ],
              },
            }}
          />
        </Box>

        <Box
          flexShrink={0}
          px={4}
          pb={2}
          bg={useColorModeValue("#F8FAFC", "#0F1720")}
          borderRadius="8px"
        >
          {/* Gradient */}
          <HStack spacing={3} align="center">
            <Text fontSize="13px" fontWeight="600">
              3.340 V
            </Text>

            <Box
              flex="1"
              h="16px"
              borderRadius="4px"
              bg="linear-gradient(to right,
                #3E8E1A,
                #8BC34A,
                #F6C000,
                #FF7A00,
                #D7191C)"
            />

            <Text fontSize="13px" fontWeight="600">
              3.365 V
            </Text>
          </HStack>

          {/* Legend */}
          <HStack
            justify="center"
            spacing={10}
            mt={4}
          >
            <HStack spacing={2}>
              <Box w="12px" h="12px" bg="#4CAF50" borderRadius="2px" />
              <Text fontSize="13px">Min</Text>
            </HStack>

            <HStack spacing={2}>
              <Box w="12px" h="12px" bg="#7CB342" borderRadius="2px" />
              <Text fontSize="13px">Avg</Text>
            </HStack>

            <HStack spacing={2}>
              <Box w="12px" h="12px" bg="#E53935" borderRadius="2px" />
              <Text fontSize="13px">Max</Text>
            </HStack>
          </HStack>

          {/* Footer */}
          <HStack
            mt={6}
            justify="space-between"
            fontSize="13px"
            fontWeight="600"
          >
            <Text>
              Max Cell:
              <Text as="span" color="#E53935">
                {" "}
                3.365 V (Cell 23)
              </Text>
            </Text>

            <Text>
              Min Cell:
              <Text as="span" color="#4FC3F7">
                {" "}
                3.347 V (Cell 12)
              </Text>
            </Text>

            <Text>
              Delta: 18 mV
            </Text>
          </HStack>
        </Box>
      </VStack>
    </GraphLayout>
  );
};

export default CellVoltageHeatmap;
