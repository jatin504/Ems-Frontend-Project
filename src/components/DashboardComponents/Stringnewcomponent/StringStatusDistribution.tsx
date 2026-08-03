import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const stringRows = Array.from(
  { length: 24 },
  (_, i) => i + 1
);

const StringStatusDistribution = () => {

  const cardBg = useColorModeValue(
    "#ffffff",
    "#0F2235"
  );

  const borderColor = useColorModeValue(
    "#E6EEF6",
    "#1F3B56"
  );

  const textColor = useColorModeValue(
    "gray.800",
    "white"
  );

  const subText = useColorModeValue(
    "#5A6B78",
    "#8FA8C0"
  );

  const { data, fetchData } =
    useTimeseriesData();

  /* ================= API ================= */

  useEffect(() => {

    const fetchStatusData = () => {

      fetchData({
        devices: {
          patterns: ["_inverter_inverter_"],
          ids: [],
        },

        keys: stringRows.map((index) => ({
          key: `string_${index}_current`,
          alias: `string_${index}_current`,
          keyType: "common",
        })),

        aggregation: {
          func: "last",
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

    fetchStatusData();

    const interval = setInterval(() => {

      fetchStatusData();

    }, 60000);

    return () => clearInterval(interval);

  }, []);

  /* ================= MAP ================= */

  const mappedData = useMemo(() => {

    const widgetData =
      data as WidgetData | null;

    if (!widgetData) {

      return {
        totalStrings: 0,
        normal: 0,
        offline: 0,
      };

    }

    let totalStrings = 0;

    let normal = 0;

    let offline = 0;

    Object.keys(widgetData).forEach(
      (deviceId) => {

        const d = widgetData[deviceId];

        stringRows.forEach((index) => {

          totalStrings += 1;

          const arr =
            d[`string_${index}_current`];

          const value =
            arr && arr.length > 0
              ? Number(
                  arr[arr.length - 1]
                    ?.value
                )
              : 0;

          if (value > 0) {

            normal += 1;

          } else {

            offline += 1;

          }

        });

      }
    );

    return {

      totalStrings,

      normal,

      offline,
    };

  }, [data]);

  /* ================= PERCENT ================= */

  const normalPercent =
    mappedData.totalStrings > 0
      ? (
          (mappedData.normal /
            mappedData.totalStrings) *
          100
        ).toFixed(1)
      : "0";

  const offlinePercent =
    mappedData.totalStrings > 0
      ? (
          (mappedData.offline /
            mappedData.totalStrings) *
          100
        ).toFixed(1)
      : "0";

  /* ================= STATUS ================= */

  const statusData = [
    {
      label: "Normal",
      value: `${mappedData.normal} (${normalPercent}%)`,
      color: "#32CD32",
    },

    {
      label: "High Current Alarm",
      value: "--",
      color: "#FFD700",
    },

    {
      label: "Low Current Alarm",
      value: "--",
      color: "#FF4D4F",
    },

    {
      label: "Offline",
      value: `${mappedData.offline} (${offlinePercent}%)`,
      color: "#7F8C8D",
    },
  ];

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="12px"
      p={4}
      h="100%"
    >
      <Text
        color={textColor}
        fontSize="13px"
        fontWeight="700"
        mb={4}
      >
        STRING STATUS DISTRIBUTION
      </Text>

      <Flex align="center" gap={5}>
        {/* DONUT CHART */}
        <Box
          w="140px"
          h="140px"
          borderRadius="50%"
          background={`conic-gradient(
            #32CD32 0% ${normalPercent}%,
            #FFD700 ${normalPercent}% ${normalPercent}%,
            #FF4D4F ${normalPercent}% ${normalPercent}%,
            #7F8C8D ${normalPercent}% 100%
          )`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Box
            w="90px"
            h="90px"
            bg={cardBg}
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Text
              color={textColor}
              fontSize="24px"
              fontWeight="700"
            >
              {mappedData.totalStrings}
            </Text>

            <Text
              color={subText}
              fontSize="11px"
            >
              Total Strings
            </Text>
          </Box>
        </Box>

        {/* LEGENDS */}
        <Box flex={1}>
          {statusData.map((item, index) => (
            <Flex
              key={index}
              justify="space-between"
              align="center"
              mb={3}
            >
              <Flex
                align="center"
                gap={2}
              >
                <Box
                  w="10px"
                  h="10px"
                  borderRadius="2px"
                  bg={item.color}
                />

                <Text
                  color={subText}
                  fontSize="12px"
                >
                  {item.label}
                </Text>
              </Flex>

              <Text
                color={textColor}
                fontSize="12px"
                fontWeight="600"
              >
                {item.value}
              </Text>
            </Flex>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default StringStatusDistribution;