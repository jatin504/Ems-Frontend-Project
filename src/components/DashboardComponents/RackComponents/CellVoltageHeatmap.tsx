import React, { useState } from "react";
import { Box, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import HeatmapChart from "../../Graphs/RevampCharts/Heatmapchart";

const CellVoltageHeatmap = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [parameter, setParameter] = useState({
    label: "Cell Voltage",
    value: "voltage",
  });

  const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0");
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#2D3748");
  const tooltipTextColor = useColorModeValue("#1A202C", "#F7FAFC");

  const parameterOptions = [
    {
      label: "Cell Voltage",
      value: "voltage",
    },
    {
      label: "Cell Temperature",
      value: "temperature",
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

  const yAxisCategories = [
    "Rack-1",
    "Rack-2",
    "Rack-3",
    "Rack-4",
    "Rack-5",
    "Rack-6",
    "Rack-7",
    "Rack-8",
    "Rack-9",
    "Rack-10",
  ];

  const heatmapSeries = [
    {
      type: "heatmap",
      name: "Cell Voltage",
      borderWidth: 1,
      data: [
        [0, 0, 3.31],
        [1, 0, 3.32],
        [2, 0, 3.33],
        [3, 0, 3.34],
        [4, 0, 3.35],
        [5, 0, 3.36],

        [0, 1, 3.33],
        [1, 1, 3.32],
        [2, 1, 3.34],
        [3, 1, 3.35],
        [4, 1, 3.37],
        [5, 1, 3.38],

        [0, 2, 3.34],
        [1, 2, 3.35],
        [2, 2, 3.33],
        [3, 2, 3.32],
        [4, 2, 3.36],
        [5, 2, 3.38],

        [0, 3, 3.32],
        [1, 3, 3.33],
        [2, 3, 3.35],
        [3, 3, 3.36],
        [4, 3, 3.34],
        [5, 3, 3.37],

        [0, 4, 3.31],
        [1, 4, 3.33],
        [2, 4, 3.35],
        [3, 4, 3.36],
        [4, 4, 3.37],
        [5, 4, 3.38],
      ],
    },
  ];
    return (
    <GraphLayout
      title="Cell Voltage Heatmap"
      titleLengthSVG={75}
      titleLengthLongSVG={1680}
      width={["100%"]}
      height={"100%"}
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
        {/* Top Right Dropdown */}

        <HStack
          justify="flex-end"
          w="100%"
          mb={1}
        >
          <Select
            isMulti={false}
            size="sm"
            variant="flushed"
            closeMenuOnSelect
            options={parameterOptions}
            value={parameter}
            selectedOptionColorScheme="green"
            focusBorderColor="#062D59"
            onChange={(e) => setParameter(e!)}
            chakraStyles={{
              valueContainer: (provided) => ({
                ...provided,
                fontSize: "10px",
                width: "170px",
              }),
              control: (provided) => ({
                ...provided,
                minHeight: "20px",
                height: "20px",
              }),
              option: (provided) => ({
                ...provided,
                fontSize: "10px",
                height: "18px",
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "100px",
              }),
            }}
          />
        </HStack>

        {/* Heatmap */}

        <Box
          flex="1"
          w="100%"
          minH="220px"
        >
          <HeatmapChart
            height={250}
            apiData={heatmapSeries}
            isFullscreen={isFullscreen}
            onFullscreenChange={setIsFullscreen}
            props={{
              colorAxis: {
                min: 3.30,
                max: 3.40,
                stops: [
                  [0, "#16a34a"],
                  [0.5, "#facc15"],
                  [1, "#dc2626"],
                ],
              },

              xAxis: {
                type: "category",
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
                categories: yAxisCategories,
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
                    <b>${this.series.yAxis.categories[this.point.y]}</b><br/>
                    ${xAxisCategories[this.point.x]}<br/>
                    <b>${this.point.value} V</b>
                  `;
                },
              },
            }}
          />
        </Box>
      </VStack>
    </GraphLayout>
  );
};

export default CellVoltageHeatmap;