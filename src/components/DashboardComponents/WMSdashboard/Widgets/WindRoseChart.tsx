import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Flex,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import HighchartsMore from "highcharts/highcharts-more";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

HighchartsMore(Highcharts);

const legends = [
  { label: "> 10", color: "#ff5b57" },
  { label: "7 - 10", color: "#ff9f1a" },
  { label: "5 - 7", color: "#ffd43b" },
  { label: "3 - 5", color: "#7bdc28" },
  { label: "1 - 3", color: "#2ed3e6" },
  { label: "0 - 1", color: "#3f7df5" },
];

interface WindRoseChartProps {
  selectedDevice: string;
}

const WindRoseChart = ({
  selectedDevice,
}: WindRoseChartProps) => {

  const bg = useColorModeValue(
    "#ffffff",
    "linear-gradient(180deg,#082041,#071b34)"
  );

  const border = useColorModeValue(
    "#d9e2ef",
    "#16365f"
  );

  const text = useColorModeValue(
    "#1a202c",
    "#dbe7ff"
  );

  const grid = useColorModeValue(
    "#d6dee8",
    "#2469c3"
  );

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {

    if (!selectedDevice) return;

    const payload = {

      devices: {
        ids: [selectedDevice],
        patterns: [],
      },

      keys: [

        {
          key: "temperature",
          alias: "Wind Speed",
          keyType: "timeseries",
        },

        {
          key: "wind_direction",
          alias: "Wind Direction",
          keyType: "timeseries",
        },

      ],

      aggregation: {
        func: "avg",
        interval: 10,
        intervalType: "minute",
      },

      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "day",
      },

      orderBy: "ASC",

    } as any;

    const fetchWind = () => fetchData(payload);

    fetchWind();

    const interval = setInterval(
      fetchWind,
      60000
    );

    return () => clearInterval(interval);

  }, [selectedDevice]);

  const chartOptions = useMemo(() => {

    const directions = [
      "N",
      "NE",
      "E",
      "SE",
      "S",
      "SW",
      "W",
      "NW",
    ];

    const counts = [0,0,0,0,0,0,0,0];

    const speedArr =
      data?.[selectedDevice]?.["Wind Speed"] || [];

    const dirArr =
      data?.[selectedDevice]?.["Wind Direction"] || [];

    speedArr.forEach((item: any, index: number) => {

      const speed = Number(item.value);

      const direction = Number(
        dirArr?.[index]?.value || 0
      );

      let bucket = 0;

      if (
        direction >= 337.5 ||
        direction < 22.5
      ) bucket = 0;

      else if (direction < 67.5) bucket = 1;

      else if (direction < 112.5) bucket = 2;

      else if (direction < 157.5) bucket = 3;

      else if (direction < 202.5) bucket = 4;

      else if (direction < 247.5) bucket = 5;

      else if (direction < 292.5) bucket = 6;

      else bucket = 7;

      counts[bucket] += speed;

    });

    return {

      chart: {
        polar: true,
        type: "column",
        backgroundColor: "transparent",
        height: 350,
      },

      title: {
        text: "",
      },

      credits: {
        enabled: false,
      },

      pane: {
        size: "80%",
      },

      xAxis: {

        categories: directions,

        tickmarkPlacement: "on",

        lineWidth: 0,

        labels: {
          style: {
            color: text,
            fontSize: "13px",
            fontWeight: "600",
          },
        },

      },

      yAxis: {

        min: 0,

        gridLineColor: grid,

        endOnTick: false,

        showLastLabel: true,

        labels: {
          style: {
            color: text,
          },
        },

      },

      tooltip: {
        shared: true,
        backgroundColor: "#0f172a",
        style: {
          color: "#ffffff",
        },
      },

      legend: {
        enabled: false,
      },

      plotOptions: {

        series: {
          stacking: "normal",
          groupPadding: 0,
          pointPlacement: "on",
        },

        column: {
          borderWidth: 0,
        },

      },

      series: [

        {
          name: "0 - 1",
          color: "#3f7df5",
          data: counts.map((v) => v * 0.12),
        },

        {
          name: "1 - 3",
          color: "#2ed3e6",
          data: counts.map((v) => v * 0.18),
        },

        {
          name: "3 - 5",
          color: "#7bdc28",
          data: counts.map((v) => v * 0.22),
        },

        {
          name: "5 - 7",
          color: "#ffd43b",
          data: counts.map((v) => v * 0.16),
        },

        {
          name: "7 - 10",
          color: "#ff9f1a",
          data: counts.map((v) => v * 0.10),
        },

        {
          name: "> 10",
          color: "#ff5b57",
          data: counts.map((v) => v * 0.08),
        },

      ],

    };

  }, [data, selectedDevice, text, grid]);

  return (

    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="10px"
      p="14px"
      h="100%"
      minH="420px"
      w="100%"
    >

      {/* TITLE */}
      <Text
        color={text}
        fontWeight="700"
        fontSize="16px"
        mb="8px"
      >
        Wind Rose (Today)
      </Text>

      <Flex
        justify="space-between"
        align="flex-start"
        mt="6px"
        h="calc(100% - 50px)"
      >

        {/* CHART */}
        <Box
          w="68%"
          h="100%"
        >

          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
          />

        </Box>

        {/* LEGEND */}
        <VStack
          align="start"
          spacing="12px"
          w="32%"
          pt="18px"
        >

          <Text
            color={text}
            fontSize="16px"
            mb="4px"
          >
            Wind Speed (m/s)
          </Text>

          {legends.map((item, index) => (

            <Flex
              key={index}
              align="center"
              gap="10px"
            >

              <Box
                w="14px"
                h="14px"
                bg={item.color}
              />

              <Text
                color={text}
                fontSize="15px"
              >
                {item.label}
              </Text>

            </Flex>

          ))}

          <Text
            color={text}
            fontSize="16px"
            mt="22px"
          >
            Calm: 2.1%
          </Text>

        </VStack>

      </Flex>

    </Box>
  );
};

export default WindRoseChart;