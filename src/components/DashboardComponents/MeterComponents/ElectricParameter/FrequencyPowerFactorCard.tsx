import {
  Box,
  Divider,
  Flex,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import { useEffect, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const FrequencyPowerFactorCard = ({
  selectedMeter,
}: Props) => {
  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!selectedMeter) return;

    const loadData = () => {
      fetchData({
        devices: {
          patterns: [],
          ids: [selectedMeter],
        },

        keys: [
          {
            key: "frequency",
            alias: "frequency",
            keyType: "timeseries",
          },
          {
            key: "pf_r",
            alias: "pf_r",
            keyType: "timeseries",
          },
          {
            key: "pf_y",
            alias: "pf_y",
            keyType: "timeseries",
          },
          {
            key: "pf_b",
            alias: "pf_b",
            keyType: "timeseries",
          },
          {
            key: "avg_pf",
            alias: "avg_pf",
            keyType: "timeseries",
          },
        ],

        aggregation: {
          func: "none",
          interval: 1,
          intervalType: "minute",
        },

        timeRange: {
          type: "relative",
          relativeType: "currentDaySoFar",
        },

        orderBy: "DESC",
      } as any);
    };

    loadData();

    const intervalId = setInterval(
      loadData,
      60000
    );

    return () => clearInterval(intervalId);
  }, [selectedMeter]);

  const frequencyPFData = useMemo(() => {
    const meterData =
      (data as any)?.[selectedMeter || ""] || {};

    const frequency = Number(
      meterData?.frequency?.[0]?.value || 0
    );

    const pfR = Number(
      meterData?.pf_r?.[0]?.value || 0
    );

    const pfY = Number(
      meterData?.pf_y?.[0]?.value || 0
    );

    const pfB = Number(
      meterData?.pf_b?.[0]?.value || 0
    );

    const avgPF =
      Number(
        meterData?.avg_pf?.[0]?.value || 0
      ) ||
      (pfR + pfY + pfB) / 3;

    const pfMax = Math.max(
      pfR,
      pfY,
      pfB
    );

    const pfMin = Math.min(
      pfR,
      pfY,
      pfB
    );

    const pfType =
      avgPF >= 0 ? "Leading" : "Lagging";

    const pfPercent = Math.min(
      Math.abs(avgPF) * 100,
      100
    );

    return {
      frequency,
      pfR,
      pfY,
      pfB,
      avgPF,
      pfMax,
      pfMin,
      pfType,
      pfPercent,
    };
  }, [data, selectedMeter]);

  const bg = useColorModeValue(
    "#ffffff",
    "#071d36"
  );

  const borderColor = useColorModeValue(
    "rgba(0,0,0,0.08)",
    "rgba(255,255,255,0.08)"
  );

  const textColor = useColorModeValue(
    "#1A202C",
    "#D7E4FF"
  );

  const secondaryText = useColorModeValue(
    "#4A5568",
    "#B8C7E0"
  );

  const positive = useColorModeValue(
    "#84CC16",
    "#84CC16"
  );

  const gaugeOptions: Highcharts.Options =
    useMemo(
      () => ({
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
                y: frequencyPFData.pfPercent,
                color: "#84CC16",
              },
              {
                y:
                  100 -
                  frequencyPFData.pfPercent,
                color: "#CBD5E1",
              },
            ],
          },
        ],
      }),
      [frequencyPFData.pfPercent]
    );

  return (
    <Box
      bg={bg}
      borderRadius="8px"
      border={`1px solid ${borderColor}`}
      overflow="hidden"
      h="100%"
    >
      <Box
        px="14px"
        py="10px"
        borderBottom={`1px solid ${borderColor}`}
      >
        <Text
          fontSize="13px"
          fontWeight="700"
          color={textColor}
        >
          FREQUENCY & POWER FACTOR
        </Text>
      </Box>

      <Flex
        p="14px"
        h="220px"
      >
        <Box flex="1">
          <Text
            fontSize="11px"
            color={secondaryText}
            mb={5}
            fontWeight="600"
          >
            FREQUENCY
          </Text>

          <Text
            fontSize="38px"
            fontWeight="700"
            color="#84CC16"
            textAlign="center"
            mb={8}
          >
            {frequencyPFData.frequency.toFixed(
              2
            )}
            <Text
              as="span"
              fontSize="16px"
              ml={1}
            >
              Hz
            </Text>
          </Text>

          <VStack
            spacing={4}
            align="stretch"
          >
            <Flex justify="space-between">
              <Text
                fontSize="12px"
                color={textColor}
              >
                Frequency Max
              </Text>

              <Text
                fontSize="12px"
                color={textColor}
                fontWeight="600"
              >
                --
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text
                fontSize="12px"
                color={textColor}
              >
                Frequency Min
              </Text>

              <Text
                fontSize="12px"
                color={textColor}
                fontWeight="600"
              >
                --
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text
                fontSize="12px"
                color={textColor}
              >
                RoCoF (Rate of Change)
              </Text>

              <Text
                fontSize="12px"
                color={textColor}
                fontWeight="600"
              >
                --
              </Text>
            </Flex>
          </VStack>
        </Box>

        <Divider
          orientation="vertical"
          mx={5}
          borderColor={borderColor}
        />

        <Box flex="1">
          <Text
            fontSize="11px"
            color={secondaryText}
            mb="-18px"
            fontWeight="600"
          >
            POWER FACTOR
          </Text>

          <Box
            position="relative"
            w="240px"
            h="150px"
            mx="auto"
            mt="-10px"
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={gaugeOptions}
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
              {Math.abs(
                frequencyPFData.avgPF
              ).toFixed(2)}
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
              {frequencyPFData.pfType}
            </Text>
          </Box>

          <VStack
            spacing={3}
            align="stretch"
            mt="-10px"
          >
            <Flex justify="space-between">
              <Text
                fontSize="12px"
                color={textColor}
              >
                PF Max
              </Text>

              <Text
                fontSize="12px"
                color={textColor}
                fontWeight="600"
              >
                {frequencyPFData.pfMax.toFixed(
                  3
                )}{" "}
                {
                  frequencyPFData.pfType
                }
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text
                fontSize="12px"
                color={textColor}
              >
                PF Min
              </Text>

              <Text
                fontSize="12px"
                color={textColor}
                fontWeight="600"
              >
                {frequencyPFData.pfMin.toFixed(
                  3
                )}{" "}
                {
                  frequencyPFData.pfType
                }
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text
                fontSize="12px"
                color={textColor}
              >
                PF Average
              </Text>

              <Text
                fontSize="12px"
                color={textColor}
                fontWeight="600"
              >
                {Math.abs(
                  frequencyPFData.avgPF
                ).toFixed(3)}{" "}
                {
                  frequencyPFData.pfType
                }
              </Text>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default FrequencyPowerFactorCard;