import React, { useMemo, useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import HeatmapChart from "../../Graphs/RevampCharts/Heatmapchart";

const CellVoltageHeatmap = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [viewBy, setViewBy] = useState({
    label: "Voltage",
    value: "voltage",
  });

  const [viewType, setViewType] = useState({
    label: "Top View",
    value: "top",
  });

  const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0");
  const tooltipBg = useColorModeValue("#FFFFFF", "#1E293B");
  const tooltipText = useColorModeValue("#1E293B", "#F8FAFC");

  const borderColor = useColorModeValue("#E2E8F0", "#27445E");

  const dropdownStyle = {
    valueContainer: (provided: any) => ({
      ...provided,
      fontSize: "11px",
    }),

    control: (provided: any) => ({
      ...provided,
      minHeight: "28px",
      height: "28px",
    }),

    option: (provided: any) => ({
      ...provided,
      fontSize: "11px",
    }),
  };

  const parameterOptions = [
    {
      label: "Voltage",
      value: "voltage",
    },
    {
      label: "Temperature",
      value: "temperature",
    },
  ];

  const viewOptions = [
    {
      label: "Top View",
      value: "top",
    },
    {
      label: "Front View",
      value: "front",
    },
  ];

  const xAxisCategories = Array.from(
    { length: 35 },
    (_, i) => String(i + 1).padStart(2, "0")
  );

  const yAxisCategories = [
    "M01",
    "M02",
    "M03",
    "M04",
    "M05",
    "M06",
    "M07",
    "M08",
  ];

  const heatmapSeries = useMemo(() => {
    const data: any[] = [];

    for (let row = 0; row < yAxisCategories.length; row++) {
      for (let col = 0; col < xAxisCategories.length; col++) {
        let value =
          viewBy.value === "voltage"
            ? Number((3.355 + (Math.random() - 0.5) * 0.012).toFixed(3))
            : Number((31 + Math.random() * 12).toFixed(1));

        if (viewBy.value === "voltage") {
          if (row === 0 && col === 30) value = 3.365;
          if (row === 5 && col === 12) value = 3.347;
        }

        data.push([col, row, value]);
      }
    }

    return [
      {
        type: "heatmap",
        borderWidth: 1,
        borderColor,
        data,

        dataLabels: {
          enabled: true,
          color: "#FFFFFF",
          style: {
            fontSize: "7px",
            textOutline: "none",
            fontWeight: "500",
          },

          formatter: function (this: any) {
            return this.point.value;
          },
        },
      },
    ];
  }, [viewBy, borderColor]);

  return (
    <GraphLayout
      title="Cell Voltage Heatmap"
      titleLengthSVG={82}
      titleLengthLongSVG={1700}
      width={["100%"]}
      height="100%"
      mt="2"
      fullScreen
      timeWindow={false}
    >
      <VStack
        w="100%"
        h="100%"
        spacing={3}
        align="stretch"
      >
        {/* Header */}

        <HStack
          justify="space-between"
          w="100%"
        >
          <HStack spacing={2}>
            <Text
              fontSize="11px"
              fontWeight="600"
            >
              View By
            </Text>

            <Box w="130px">
              <Select
                options={parameterOptions}
                value={viewBy}
                onChange={(e) => setViewBy(e!)}
                size="sm"
                chakraStyles={dropdownStyle}
              />
            </Box>
          </HStack>

          <HStack spacing={2}>
            <Text
              fontSize="11px"
              fontWeight="600"
            >
              View
            </Text>

            <Box w="120px">
              <Select
                options={viewOptions}
                value={viewType}
                onChange={(e) => setViewType(e!)}
                size="sm"
                chakraStyles={dropdownStyle}
              />
            </Box>
          </HStack>
        </HStack>
                {/* Heatmap */}

        <Box
          flex="1"
          w="100%"
          minH="320px"
        >
          <HeatmapChart
            height={330}
            apiData={heatmapSeries}
            isFullscreen={isFullscreen}
            onFullscreenChange={setIsFullscreen}
            props={{
              chart: {
                marginTop: 15,
                marginBottom: 40,
              },

              colorAxis: {
                min: viewBy.value === "voltage" ? 3.347 : 30,
                max: viewBy.value === "voltage" ? 3.365 : 45,

                stops: [
                  [0, "#16A34A"],
                  [0.5, "#FACC15"],
                  [1, "#DC2626"],
                ],
              },

              xAxis: {
                type: "category",
                opposite: true,
                categories: xAxisCategories,

                labels: {
                  style: {
                    color: axisLabelColor,
                    fontSize: "8px",
                  },
                },
              },

              yAxis: {
                title: null,
                reversed: true,
                categories: yAxisCategories,

                labels: {
                  style: {
                    color: axisLabelColor,
                    fontSize: "9px",
                    fontWeight: "600",
                  },
                },
              },

              legend: {
                enabled: false,
              },

              tooltip: {
                backgroundColor: tooltipBg,
                style: {
                  color: tooltipText,
                  fontSize: "11px",
                },

                formatter: function (this: any) {
                  return `
                    <b>${yAxisCategories[this.point.y]}</b><br/>
                    Cell : ${xAxisCategories[this.point.x]}<br/>
                    <b>${
                      viewBy.value === "voltage"
                        ? `${this.point.value} V`
                        : `${this.point.value} °C`
                    }</b>
                  `;
                },
              },
            }}
          />
        </Box>

        {/* Bottom Legend */}

        <HStack
          justify="space-between"
          spacing={4}
          mt={1}
        >
          <Text fontSize="10px">
            Low
          </Text>

          <Box
            flex="1"
            h="8px"
            borderRadius="full"
            bg="linear-gradient(90deg,#16A34A,#FACC15,#DC2626)"
          />

          <Text fontSize="10px">
            High
          </Text>

          <HStack spacing={4}>
            <HStack spacing={1}>
              <Box
                w="10px"
                h="10px"
                borderRadius="2px"
                bg="#16A34A"
              />

              <Text fontSize="10px">
                Normal
              </Text>
            </HStack>

            <HStack spacing={1}>
              <Box
                w="10px"
                h="10px"
                borderRadius="2px"
                bg="#FACC15"
              />

              <Text fontSize="10px">
                Warning
              </Text>
            </HStack>

            <HStack spacing={1}>
              <Box
                w="10px"
                h="10px"
                borderRadius="2px"
                bg="#DC2626"
              />

              <Text fontSize="10px">
                Critical
              </Text>
            </HStack>
          </HStack>
        </HStack>
      </VStack>
    </GraphLayout>
  );
};

export default CellVoltageHeatmap;