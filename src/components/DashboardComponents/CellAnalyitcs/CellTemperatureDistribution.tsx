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

const CellTemperatureDistribution = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0");
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#1E293B");
  const tooltipTextColor = useColorModeValue("#1A202C", "#F8FAFC");
  const legendText = useColorModeValue("#0F172A", "#E2E8F0");
  const lowColor = useColorModeValue("#2563EB", "#60A5FA");
  const normalColor = useColorModeValue("#65A30D", "#86EFAC");
  const highColor = useColorModeValue("#DC2626", "#FB7185");

  const chartData = useMemo(() => {
    const values = [
      4, 8, 18, 35, 58,
      82, 104, 96, 108, 92,
      74, 46, 20, 8
    ];

    return values.map((v, i) => {
      let color = "#2563EB";

      if (i >= 2 && i <= 3)
        color = "#38BDF8";

      if (i >= 4 && i <= 9)
        color = "#65A30D";

      if (i >= 10)
        color = "#F97316";

      if (i >= 12)
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
      title="Cell Temperature Distribution"
      titleLengthSVG={138}
      titleLengthLongSVG={1680}
      width="100%"
      height="100%"
      fullScreen
      onFullscreenChange={setIsFullscreen}
      timeWindow={false}
      mt="0"
    >
      <VStack
        spacing={2}
        h="100%"
        align="stretch"
      >
        <Box
          flex="1"
          minH={0}
        >
          <ColumnChart
            height={200}
            isFullscreen={isFullscreen}
            fullscreenHeightOffset={160}
            apiData={[
              {
                name: "Temperature",
                data: chartData,
              },
            ]}
            props={{
              xAxis: {

                categories: [
                  "20",
                  "25",
                  "30",
                  "35",
                  "40",
                  "45",
                  "50",
                  "55",
                  "60",
                  "65",
                  "70",
                  "75",
                  "80",
                  "85",
                ],

                title: {
                  text: "Temperature (°C)",
                },

                labels: {
                  style: {
                    color: axisLabelColor,
                    fontSize: isFullscreen ? "12px" : "8px",
                  },
                },
              },

              yAxis: {
                title: {
                  text: "No. of Cells",
                },

                min: 0,
                max: 120,
                tickInterval: 20,

                labels: {
                  style: {
                    color: axisLabelColor,
                    fontSize: isFullscreen ? "12px" : "8px",
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
                    <b>Temperature</b><br/>
                    ${this.x} °C<br/>
                    <b>No. of Cells : ${this.y}</b>
                  `;
                },
              },

              plotOptions: {
                column: {
                  pointWidth: isFullscreen ? 32 : 7,
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

        <HStack flexShrink={0} justify="space-between" mt={1} px={2} spacing={2} flexWrap="wrap">
          <HStack spacing={1}>
            <Box w="10px" h="10px" bg={lowColor} borderRadius="2px" />
            <Text fontSize={isFullscreen ? "13px" : "10px"} color={legendText}>
              Low (&lt;30°C)
            </Text>
          </HStack>

          <HStack spacing={1}>
            <Box w="10px" h="10px" bg={normalColor} borderRadius="2px" />
            <Text fontSize={isFullscreen ? "13px" : "10px"} color={legendText}>
              Normal (30–45°C)
            </Text>
          </HStack>

          <HStack spacing={1}>
            <Box w="10px" h="10px" bg={highColor} borderRadius="2px" />
            <Text fontSize={isFullscreen ? "13px" : "10px"} color={legendText}>
              High (&gt;45°C)
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </GraphLayout>
  );
};

export default CellTemperatureDistribution;