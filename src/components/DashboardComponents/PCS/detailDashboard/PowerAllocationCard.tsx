import React from "react";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PowerAllocationCard = () => {
  const text = useColorModeValue("#1F2937", "#E2E8F0");
  const sub = useColorModeValue("#6B7280", "#94A3B8");
  const border = useColorModeValue("#E5E7EB", "#2D3748");

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 165,
      backgroundColor: "transparent",
      spacing: [0, 0, 0, 0],
    },

    title: {
      text: "",
    },

    credits: {
      enabled: false,
    },

    exporting: {
      enabled: false,
    },

    legend: {
      enabled: false,
    },

    tooltip: {
      pointFormat: "<b>{point.y:.2f} MW</b>",
    },

    plotOptions: {
      pie: {
        innerSize: "72%",
        size: "92%",
        borderWidth: 0,

        dataLabels: {
          enabled: false,
        },

        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },

    series: [
      {
        type: "pie",

        data: [
          {
            name: "PCS-01",
            y: 12.46,
            color: "#2F80ED",
          },
          {
            name: "PCS-02",
            y: 8.90,
            color: "#43B649",
          },
          {
            name: "PCS-03",
            y: 5.20,
            color: "#F5A623",
          },
          {
            name: "PCS-04",
            y: 3.69,
            color: "#8E44EC",
          },
        ],
      },
    ],
  };

  const legend = [
    {
      name: "PCS-01",
      value: "12.46 MW (41%)",
      color: "#2F80ED",
    },
    {
      name: "PCS-02",
      value: "8.90 MW (29%)",
      color: "#43B649",
    },
    {
      name: "PCS-03",
      value: "5.20 MW (17%)",
      color: "#F5A623",
    },
    {
      name: "PCS-04",
      value: "3.69 MW (13%)",
      color: "#8E44EC",
    },
  ];

  return (
    <Box
      borderWidth="1px"
      borderColor={border}
      borderRadius="lg"
      p={4}
      w="450px"
      h="280px"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Text
        fontSize="16px"
        fontWeight="600"
        color={text}
        mb={2}
      >
        Power Allocation
      </Text>

      <Flex
        px={2}
        pt={1}
        flex={1}
        minH={0}
        justify="space-between"
        align="center"
      >
        <Box
          w="140px"
          h="140px"
          flexShrink={0}
        >
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </Box>

        <VStack
          flex={1}
          align="stretch"
          spacing={1.5}
          ml={3}
          justify="center"
        >
          {legend.map((item) => (
            <Flex
              key={item.name}
              justify="space-between"
              align="center"
              w="100%"
            >
              <HStack spacing={2} minW={0}>
                <Box
                  w="10px"
                  h="10px"
                  borderRadius="50%"
                  bg={item.color}
                  flexShrink={0}
                />

                <Text
                  fontSize="12px"
                  color={sub}
                  whiteSpace="nowrap"
                >
                  {item.name}
                </Text>
              </HStack>

              <Text
                fontSize="12px"
                fontWeight="600"
                color={text}
                whiteSpace="nowrap"
                ml={2}
              >
                {item.value}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Flex>

      <Divider
        mt={2}
        mb={2}
        borderColor={border}
      />

      <Flex
        px={2}
        py={2}
        justify="space-between"
        align="center"
        flexShrink={0}
      >
        <Box flex={1}>
          <Text
            fontSize="11px"
            color={sub}
            mb={1}
          >
            Total Plant
          </Text>

          <Text
            fontSize="24px"
            fontWeight="700"
            color={text}
            lineHeight="1"
          >
            30.25 MW
          </Text>
        </Box>

        <Divider
          orientation="vertical"
          h="48px"
          borderColor={border}
        />

        <Box
          flex={1}
          pl={5}
        >
          <Text
            fontSize="11px"
            color={sub}
            mb={1}
          >
            Total Available
          </Text>

          <Text
            fontSize="24px"
            fontWeight="700"
            color={text}
            lineHeight="1"
          >
            25.00 MW
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default PowerAllocationCard;