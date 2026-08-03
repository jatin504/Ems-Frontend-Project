import React from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface GaugeProps {
  title: string;
  value: string;
}

const MiniGauge = ({
  title,
  value,
}: GaugeProps) => {
  const textColor = useColorModeValue(
    "#0B2340",
    "#D7E4FF"
  );

  const positive = useColorModeValue(
    "#16A34A",
    "#22C55E"
  );

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 150,
      margin: [0, 0, 0, 0],
    },

    title: {
      text: undefined,
    },

    credits: {
      enabled: false,
    },

    exporting: {
      enabled: false,
    },

    tooltip: {
      enabled: false,
    },

    legend: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "92%"],
        size: "125%",
        borderWidth: 0,

        dataLabels: {
          enabled: false,
        },
      },
    },

    series: [
      {
        type: "pie",
        innerSize: "88%",
        data: [
          {
            y: 78,
            color: "#16A34A",
          },
          {
            y: 8,
            color: "#EAB308",
          },
          {
            y: 14,
            color: "#DC2626",
          },
        ],
      },
    ],
  };

  return (
    <VStack
      flex={1}
      spacing={0}
      align="center"
    >
      <Text
        color={textColor}
        fontSize="14px"
        fontWeight="500"
        mb="-18px"
        zIndex={1}
      >
        {title}
      </Text>

      <Box
        position="relative"
        w="240px"
        h="150px"
        mt="-10px"
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />

        <Text
          position="absolute"
          top="58px"
          left="50%"
          transform="translateX(-50%)"
          color={textColor}
          fontSize="18px"
          fontWeight="700"
        >
          {value}
        </Text>

        <Text
          position="absolute"
          top="88px"
          left="50%"
          transform="translateX(-50%)"
          color={positive}
          fontSize="15px"
          fontWeight="600"
        >
          Good
        </Text>
      </Box>
    </VStack>
  );
};

const PhasorQualityIndicatorsCard: React.FC =
  () => {
    const bg = useColorModeValue(
      "#FFFFFF",
      "#031D3A"
    );

    const borderColor =
      useColorModeValue(
        "rgba(3,29,58,0.06)",
        "rgba(255,255,255,0.08)"
      );

    const textColor =
      useColorModeValue(
        "#0B2340",
        "#D7E4FF"
      );

    const positive =
      useColorModeValue(
        "#16A34A",
        "#22C55E"
      );

    return (
      <Box
        bg={bg}
        borderRadius="8px"
        border={`1px solid ${borderColor}`}
        overflow="hidden"
      >
        <Box
          px="16px"
          py="12px"
          borderBottom={`1px solid ${borderColor}`}
        >
          <Text
            color={textColor}
            fontWeight="700"
            fontSize="15px"
            letterSpacing="0.3px"
          >
            PHASOR QUALITY INDICATORS
          </Text>
        </Box>

        <Box p="16px">
          <HStack
            spacing={0}
            justify="space-between"
            align="center"
          >
            <MiniGauge
              title="Voltage Unbalance"
              value="1.02%"
            />

            <Divider
              orientation="vertical"
              h="110px"
              borderColor={borderColor}
            />

            <MiniGauge
              title="Current Unbalance"
              value="0.86%"
            />

            <Divider
              orientation="vertical"
              h="110px"
              borderColor={borderColor}
            />

            <MiniGauge
              title="Angle Deviation"
              value="0.25°"
            />
          </HStack>

          <Divider
            mt={2}
            mb={3}
            borderColor={borderColor}
          />

          <Flex
            align="center"
            justify="space-between"
          >
            <HStack spacing={4}>
              <Box
                w="48px"
                h="48px"
                borderRadius="full"
                border={`2px solid ${positive}`}
                color={positive}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="28px"
                fontWeight="700"
              >
                ✓
              </Box>

              <Text
                color={textColor}
                fontSize="15px"
              >
                Phasor System Status :
              </Text>
            </HStack>

            <Text
              color={positive}
              fontSize="16px"
              fontWeight="700"
            >
              Balanced
            </Text>
          </Flex>
        </Box>
      </Box>
    );
  };

export default PhasorQualityIndicatorsCard;