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
import WidgetTitle from "../../Common/WidgetTitle";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";

const SCORE = 96;

const trendData = [
  [new Date("2026-06-10").getTime(), 74],
  [new Date("2026-06-11").getTime(), 82],
  [new Date("2026-06-12").getTime(), 82],
  [new Date("2026-06-13").getTime(), 79],
  [new Date("2026-06-14").getTime(), 80],
  [new Date("2026-06-15").getTime(), 88],
  [new Date("2026-06-16").getTime(), 88],
  [new Date("2026-06-17").getTime(), 84],
  [new Date("2026-06-18").getTime(), 84],
  [new Date("2026-06-19").getTime(), 83],
  [new Date("2026-06-20").getTime(), 83],
  [new Date("2026-06-21").getTime(), 90],
  [new Date("2026-06-22").getTime(), 90],
  [new Date("2026-06-23").getTime(), 89],
  [new Date("2026-06-24").getTime(), 89],
  [new Date("2026-06-25").getTime(), 89],
  [new Date("2026-06-26").getTime(), 94],
  [new Date("2026-06-27").getTime(), 94],
  [new Date("2026-06-28").getTime(), 87],
  [new Date("2026-06-29").getTime(), 87],
  [new Date("2026-06-30").getTime(), 87],
  [new Date("2026-07-01").getTime(), 88],
  [new Date("2026-07-02").getTime(), 96],
  [new Date("2026-07-03").getTime(), 96],
  [new Date("2026-07-04").getTime(), 84],
  [new Date("2026-07-05").getTime(), 84],
  [new Date("2026-07-06").getTime(), 91],
  [new Date("2026-07-07").getTime(), 91],
  [new Date("2026-07-08").getTime(), 90],
  [new Date("2026-07-09").getTime(), 92],
  [new Date("2026-07-10").getTime(), 91],
];

interface Props {
  selectedDevice?: string;
}

const BankHealthSummary: React.FC<Props> = ({ selectedDevice }) => {
  void selectedDevice;

  const bg = useColorModeValue("#FFFFFF", "#111827");
  const border = useColorModeValue("#E2E8F0", "#243244");
  const text = useColorModeValue("#1E293B", "#F8FAFC");
  const subText = useColorModeValue("#64748B", "#94A3B8");

  const gauge = useMemo(() => {
    const angle = (SCORE / 100) * 360;

    return {
      background: `conic-gradient(
        #6CCB2F ${angle}deg,
        #E8EDF4 ${angle}deg
      )`,
    };
  }, []);

  return (
    <GraphLayout
      title={
        <HStack spacing={2}>
<WidgetTitle>Bank Health Summary</WidgetTitle>

          <InfoOutlineIcon
            color={subText}
            boxSize={4}
          />
        </HStack>
      }
      showHeader
    >
      <Box
        bg={bg}
        h="256px"
      >
        <Flex
          px={4}
          pt={1}
          pb={1}
          h="92px"
          justify="space-between"
          align="center"
        >
          {/* Gauge */}
          <Box
            position="relative"
            w="82px"
            h="82px"
            mt="-16px"
            borderRadius="50%"
            sx={gauge}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              w="62px"
              h="62px"
              bg={bg}
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDir="column"
            >
              <Text
                fontSize="16px"
                fontWeight={700}
                lineHeight="16px"
                color={text}
              >
                {SCORE}
              </Text>

              <Text
                fontSize="10px"
                lineHeight="10px"
                color={subText}
              >
                Health Score
              </Text>

              <Text
                mt="1px"
                fontSize="9px"
                lineHeight="9px"
                color={subText}
              >
                /100
              </Text>
            </Box>
          </Box>

          {/* Legend */}
          <VStack
            align="stretch"
            spacing={1.5}
            flex={1}
            ml={4}
            mt="-16px"
          >
                        <HStack justify="space-between">
              <HStack spacing={2}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="#66CC33"
                />
                <Text fontSize="12px" color={subText}>
                  Excellent (90-100)
                </Text>
              </HStack>

              <Text
                fontSize="12px"
                fontWeight={700}
                color={text}
              >
                1
              </Text>
            </HStack>

            <HStack justify="space-between">
              <HStack spacing={2}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="#F4C430"
                />
                <Text fontSize="12px" color={subText}>
                  Good (70-90)
                </Text>
              </HStack>

              <Text
                fontSize="12px"
                fontWeight={700}
                color={text}
              >
                0
              </Text>
            </HStack>

            <HStack justify="space-between">
              <HStack spacing={2}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="#FF9800"
                />
                <Text fontSize="12px" color={subText}>
                  Warning (40-70)
                </Text>
              </HStack>

              <Text
                fontSize="12px"
                fontWeight={700}
                color={text}
              >
                0
              </Text>
            </HStack>

            <HStack justify="space-between">
              <HStack spacing={2}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="#F44336"
                />
                <Text fontSize="12px" color={subText}>
                  Critical (&lt; 40)
                </Text>
              </HStack>

              <Text
                fontSize="12px"
                fontWeight={700}
                color={text}
              >
                0
              </Text>
            </HStack>
          </VStack>
        </Flex>

        <Box
          mt="-6px"
          borderTop="1px solid"
          borderColor={border}
          pt={3}
          px={4}
        >
          <Text
            fontSize="13px"
            fontWeight={600}
            color={text}
            mb={1}
          >
            Health Trend (30 Days)
          </Text>

          <SplineGraph
            apiData={[
              {
                name: "Health Score",
                pointInterval: 24 * 60 * 60 * 1000,
                color: "#66CC33",
                data: trendData,
              },
            ]}
            height={150}
            showLegendButtons={false}
            xAxisTitle=""
            yAxisTitle=""
            legend={false}
            navigator={false}
            scrollbar={false}
            exportEnabled={false}
            tooltipSuffix="%"
          />
        </Box>
      </Box>
    </GraphLayout>
  );
};

export default BankHealthSummary;

