import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Grid,
  Text,
  VStack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const PhasorAngleSummaryCard = ({
  selectedMeter,
}: Props) => {
  const { data, fetchData } =
    useTimeseriesData();

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
        ],

        aggregation: {
          func: "none",
          interval: 1,
          intervalType: "minute",
        },

        timeRange: {
          type: "relative",
          relativeType:
            "currentDaySoFar",
        },

        orderBy: "DESC",
      } as any);
    };

    loadData();

    const intervalId = setInterval(
      loadData,
      60000
    );

    return () =>
      clearInterval(intervalId);
  }, [selectedMeter]);

  const angleData = useMemo(() => {
    const meterData =
      (data as any)?.[
        selectedMeter || ""
      ] || {};
    const readPf = (key: string): number | undefined => {
      const raw = meterData?.[key]?.[0]?.value;
      const num = Number(raw);
      if (!Number.isFinite(num)) return undefined;
      return Math.min(Math.abs(num), 1);
    };

    const pfR = readPf("pf_r");
    const pfY = readPf("pf_y");
    const pfB = readPf("pf_b");

    const values = [
      { label: "VRY", value: "--", color: "#FACC15" },
      { label: "VYB", value: "--", color: "#84CC16" },
      { label: "VBR", value: "--", color: "#C084FC" },
      { label: "IRY", value: "--", color: "#FACC15" },
      { label: "IYB", value: "--", color: "#84CC16" },
      { label: "IBR", value: "--", color: "#C084FC" },
    ];

    let voltageDeviation: string | number = "--";
    let currentDeviation: string | number = "--";

    // Compute current angle differences only when all PF values exist
    if (
      pfR !== undefined &&
      pfY !== undefined &&
      pfB !== undefined
    ) {
      const angleR = (Math.acos(pfR) * 180) / Math.PI;
      const angleY = (Math.acos(pfY) * 180) / Math.PI;
      const angleB = (Math.acos(pfB) * 180) / Math.PI;

      const IRY = Math.abs(angleR - angleY);
      const IYB = Math.abs(angleY - angleB);
      const IBR = Math.abs(angleB - angleR);

      values[3].value = IRY.toFixed(1) + "°";
      values[4].value = IYB.toFixed(1) + "°";
      values[5].value = IBR.toFixed(1) + "°";

      currentDeviation = (
        (Math.max(IRY, IYB, IBR) - Math.min(IRY, IYB, IBR)) / 2
      ).toFixed(2);
    }

    // Voltage phase angles are not available from this timeseries; keep placeholders
    return {
      values,
      voltageDeviation,
      currentDeviation,
    };
  }, [data, selectedMeter]);

  const bg = useColorModeValue(
    "#ffffff",
    "#071d36"
  );

  const borderColor =
    useColorModeValue(
      "rgba(0,0,0,0.08)",
      "rgba(255,255,255,0.08)"
    );

  const textColor =
    useColorModeValue(
      "#1A202C",
      "#D7E4FF"
    );

  const mutedText =
    useColorModeValue(
      "#4A5568",
      "#9FB4D1"
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
        px="12px"
        py="8px"
        borderBottom={`1px solid ${borderColor}`}
      >
        <Text
          fontSize="12px"
          fontWeight="700"
          color={textColor}
        >
          PHASOR ANGLE SUMMARY
        </Text>
      </Box>

      <Box p="12px">
        <Grid
          templateColumns="repeat(3,1fr)"
          gap={0}
        >
          {angleData.values.map(
            (item, index) => (
              <Flex
                key={item.label}
                direction="column"
                align="center"
                justify="center"
                py="10px"
                borderRight={
                  index % 3 !== 2
                    ? `1px solid ${borderColor}`
                    : "none"
                }
                borderBottom={
                  index < 3
                    ? `1px solid ${borderColor}`
                    : "none"
                }
              >
                <Text
                  fontSize="11px"
                  fontWeight="600"
                  color={item.color}
                  mb="2px"
                >
                  {item.label}
                </Text>

                <Text
                  fontSize="28px"
                  lineHeight="1"
                  fontWeight="700"
                  color={item.color}
                >
                  {item.value}
                </Text>
              </Flex>
            )
          )}
        </Grid>

        <Grid
          templateColumns="1fr 1fr"
          mt="14px"
        >
          <VStack
            spacing={1}
            borderRight={`1px solid ${borderColor}`}
          >
            <Text
              fontSize="11px"
              color={mutedText}
            >
              Voltage Angle Deviation
            </Text>

            <Text
              fontSize="26px"
              fontWeight="700"
              color={textColor}
            >
              {
                angleData.voltageDeviation
              }
              °
            </Text>
          </VStack>

          <VStack spacing={1}>
            <Text
              fontSize="11px"
              color={mutedText}
            >
              Current Angle Deviation
            </Text>

            <Text
              fontSize="26px"
              fontWeight="700"
              color={textColor}
            >
              {
                angleData.currentDeviation
              }
              °
            </Text>
          </VStack>
        </Grid>
      </Box>
    </Box>
  );
};

export default PhasorAngleSummaryCard;