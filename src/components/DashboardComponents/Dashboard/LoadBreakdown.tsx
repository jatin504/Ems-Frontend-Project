import React, { useMemo } from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import { BsInfoCircle } from "react-icons/bs";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";

import { PieChart } from "echarts/charts";

import {
  TooltipComponent,
  LegendComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

const data = [
  {
    name: "Production",
    value: 2.25,
    color: "#3B82F6",
  },
  {
    name: "HVAC",
    value: 1.45,
    color: "#06B6D4",
  },
  {
    name: "Compressors",
    value: 1.30,
    color: "#F5B942",
  },
  {
    name: "Lighting",
    value: 0.52,
    color: "#8B5CF6",
  },
  {
    name: "Others",
    value: 0.90,
    color: "#94A3B8",
  },
];

const total = data.reduce((a, b) => a + b.value, 0);

const LoadBreakdown = () => {
  const bg = useColorModeValue("white", "#151716");
  const border = useColorModeValue("#E5E7EB", "#2A2A2A");
  const text = useColorModeValue("#111827", "white");
  const sub = useColorModeValue("#64748B", "#A1A1AA");

  const option = useMemo(
    () => ({
      animation: false,

      tooltip: {
        trigger: "item",
      },

      series: [
        {
          type: "pie",

          radius: ["62%", "84%"],

          center: ["50%", "50%"],

          avoidLabelOverlap: false,

          label: {
            show: false,
          },

          labelLine: {
            show: false,
          },

          data: data.map((d) => ({
            value: d.value,
            name: d.name,
            itemStyle: {
              color: d.color,
            },
          })),
        },
      ],
    }),
    []
  );

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      h="320px"
      p={4}
    >
      <Flex
        justify="space-between"
        align="center"
        mb={3}
      >
        <HStack spacing={2}>
          <Text
            fontWeight="700"
            fontSize="18px"
            color={text}
          >
            Load Breakdown
          </Text>

          <Text
            color={sub}
            fontSize="14px"
          >
            (Now)
          </Text>

          <Icon
            as={BsInfoCircle}
            color={sub}
            boxSize={4}
          />
        </HStack>
      </Flex>

      <Flex
        gap={4}
        align="center"
      >
          <Box position="relative" w="180px" h="180px">

  <ReactECharts
    echarts={echarts}
    option={option}
    style={{
      width: "180px",
      height: "180px",
    }}
  />

  {/* Center Value */}

  <Flex
    position="absolute"
    inset="0"
    align="center"
    justify="center"
    direction="column"
    pointerEvents="none"
  >
    <Text
      fontSize="18px"
      fontWeight="700"
      color={text}
      lineHeight={1}
    >
      6.42
    </Text>

    <Text
      fontSize="13px"
      color={sub}
      mt={1}
    >
      MW
    </Text>
  </Flex>

</Box>

{/* Right Legend */}

<VStack
  flex={1}
  align="stretch"
  spacing={3}
>
  {data.map((item) => (
    <Flex
      key={item.name}
      justify="space-between"
      align="center"
    >
      <HStack spacing={2}>
        <Box
          w="10px"
          h="10px"
          borderRadius="2px"
          bg={item.color}
        />

        <Text
          fontSize="13px"
          color={text}
        >
          {item.name}
        </Text>
      </HStack>

      <Text
        fontSize="13px"
        fontWeight="600"
        color={text}
      >
        {item.value.toFixed(2)} MW
      </Text>
    </Flex>
  ))}
</VStack>

</Flex>

<Box
  mt={5}
  borderTop="1px solid"
  borderColor={border}
  pt={3}
>
  <Flex
    justify="space-between"
    align="center"
  >
    <Text
      color={sub}
      fontSize="14px"
      fontWeight="500"
    >
      Total
    </Text>

    <Text
      color={text}
      fontSize="22px"
      fontWeight="700"
    >
      {total.toFixed(2)} MW
    </Text>
  </Flex>
</Box>
    </Box>
  );
};

export default LoadBreakdown;