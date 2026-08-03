import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const PhasorRelationshipCard = ({
  selectedMeter,
}: Props) => {
  const { data, fetchData } =
    useTimeseriesData();

  useEffect(() => {
    if (!selectedMeter) return;

    const doFetch = () => {
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

    doFetch();

    const interval = setInterval(
      doFetch,
      60000
    );

    return () =>
      clearInterval(interval);
  }, [selectedMeter]);

  const relationshipData =
    useMemo(() => {
      const meterData =
        (data as any)?.[
          selectedMeter || ""
        ] || {};

      const pfR = Number(
        meterData?.pf_r?.[0]?.value ||
          0
      );

      const pfY = Number(
        meterData?.pf_y?.[0]?.value ||
          0
      );

      const pfB = Number(
        meterData?.pf_b?.[0]?.value ||
          0
      );

      const getAngle = (pf: number) => {
        const safePf = Math.min(
          Math.max(Math.abs(pf), 0),
          1
        );

        const angle =
          Math.acos(safePf) *
          (180 / Math.PI);

        return angle.toFixed(1);
      };

      return [
        {
          color: "#FACC15",
          phase: "Phase R (Va vs Ia)",
          value: `${getAngle(
            pfR
          )}° ${
            pfR >= 0
              ? "(Lagging)"
              : "(Leading)"
          }`,
        },

        {
          color: "#84CC16",
          phase: "Phase Y (Vb vs Ib)",
          value: `${getAngle(
            pfY
          )}° ${
            pfY >= 0
              ? "(Lagging)"
              : "(Leading)"
          }`,
        },

        {
          color: "#C084FC",
          phase: "Phase B (Vc vs Ic)",
          value: `${getAngle(
            pfB
          )}° ${
            pfB >= 0
              ? "(Lagging)"
              : "(Leading)"
          }`,
        },
      ];
    }, [data, selectedMeter]);

  const averageDisplacement =
    useMemo(() => {
      const meterData =
        (data as any)?.[
          selectedMeter || ""
        ] || {};

      const avgPf = Number(
        meterData?.avg_pf?.[0]
          ?.value || 0
      );

      const safePf = Math.min(
        Math.max(Math.abs(avgPf), 0),
        1
      );

      const angle =
        Math.acos(safePf) *
        (180 / Math.PI);

      return `${angle.toFixed(1)}° ${
        avgPf >= 0
          ? "(Lagging)"
          : "(Leading)"
      }`;
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

  const mutedColor =
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
          PHASOR RELATIONSHIP (V vs I)
        </Text>
      </Box>

      <Box p="12px">
        <VStack
          spacing={5}
          align="stretch"
        >
          {relationshipData.map(
            (item) => (
              <Flex
                key={item.phase}
                justify="space-between"
                align="center"
              >
                <HStack spacing={3}>
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="50%"
                    bg={item.color}
                  />

                  <Text
                    fontSize="11px"
                    color={textColor}
                  >
                    {item.phase}
                  </Text>
                </HStack>

                <Text
                  fontSize="11px"
                  color={textColor}
                >
                  {item.value}
                </Text>
              </Flex>
            )
          )}
        </VStack>

        <Divider
          my={5}
          borderColor={borderColor}
        />

        <Flex
          justify="space-between"
          align="center"
        >
          <Text
            fontSize="11px"
            color={mutedColor}
          >
            Average Phase
            Displacement
          </Text>

          <Text
            fontSize="11px"
            color={textColor}
          >
            {averageDisplacement}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default PhasorRelationshipCard;