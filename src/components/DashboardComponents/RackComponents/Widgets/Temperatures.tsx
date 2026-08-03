import React from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

const Row: React.FC<{
  title: string;
  value: string;
  subLeft: string;
  subRight: string;
  color?: string;
}> = ({
  title,
  value,
  subLeft,
  subRight,
  color = "#ffffff",
}) => {
  const rowBg = useColorModeValue(
    "#F5F7F8",
    "#242929"
  );

  const rowBorder = useColorModeValue(
    "#e5e7eb",
    "#1c2635"
  );

  const titleColor = useColorModeValue(
    "#0f172a",
    "gray.300"
  );

  const subColor = useColorModeValue(
    "#94a3b8",
    "gray.500"
  );

  return (
    <Box
      w="100%"
      h="66px"
      bg={rowBg}
      border={`1px solid ${rowBorder}`}
      borderRadius="8px"
      p="12px"
    >
      <Flex
        align="center"
        justify="space-between"
        w="100%"
        gap="12px"
      >
        <Box flex="1" minW={0}>
          <Text
            fontWeight={400}
            fontSize="14px"
            color={titleColor}
            noOfLines={1}
          >
            {title}
          </Text>
        </Box>

        <Box
          flex="0 0 auto"
          display="flex"
          flexDir="column"
          alignItems="flex-end"
          gap="4px"
        >
          <Text
            textAlign="right"
            fontWeight={600}
            fontSize="16px"
            color={color}
          >
            {value}
          </Text>

          <Flex
            w="136px"
            h="18px"
            align="center"
            justify="flex-end"
            gap="20px"
            ml="auto"
          >
            <Text
              fontSize="12px"
              color={subColor}
              whiteSpace="nowrap"
            >
              {subLeft}
            </Text>

            <Text
              fontSize="12px"
              color={subColor}
              whiteSpace="nowrap"
            >
              {subRight}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

type Props = {
  rackId?: string;
};

const TemperatureCards: React.FC<Props> = ({
  rackId,
}) => {
  const cardBg = useColorModeValue(
    "#ffffff",
    "#161B1B"
  );

  const cardBorder = useColorModeValue(
    "#e5e7eb",
    "#1c2635"
  );

  const headingColor = useColorModeValue(
    "#0f172a",
    "gray.300"
  );

  const { data, fetchData } =
    useTimeseriesData();

  React.useEffect(() => {
    if (!rackId) return;

    fetchData({
      devices: {
        ids: [rackId],
        patterns: [],
      },

      keys: [
        {
          key: "max_cell_temperature",
          alias: "max_temp",
          keyType: "common",
        },
        {
          key: "cell_number_in_rack_of_max_cell_temperature",
          alias: "max_cell_no",
          keyType: "common",
        },

        {
          key: "min_cell_temperature",
          alias: "min_temp",
          keyType: "common",
        },
        {
          key: "cell_number_in_rack_of_min_cell_temperature",
          alias: "min_cell_no",
          keyType: "common",
        },

        {
          key: "avg_cell_temperature",
          alias: "avg_temp",
          keyType: "common",
        },
      ],

      aggregation: {
        func: "none",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "minute",
      },

      orderBy: "ASC",
    } as any);
  }, [rackId]);

  const values = React.useMemo(() => {
    if (!data || typeof data !== "object") return null;

    const latestValues: Record<string, any> = {};

    Object.values(data).forEach((deviceObj: any) => {
      if (deviceObj && typeof deviceObj === "object") {
        Object.entries(deviceObj).forEach(([metric, points]: any) => {
          if (Array.isArray(points) && points.length > 0) {
            const latestPoint = points[points.length - 1];
            latestValues[metric] = latestPoint?.value ?? 0;
          }
        });
      }
    });

    return {
      maxTemp: latestValues["max_temp"] ?? 0,
      maxCellNo: latestValues["max_cell_no"] ?? "-",
      minTemp: latestValues["min_temp"] ?? 0,
      minCellNo: latestValues["min_cell_no"] ?? "-",
      avgTemp: latestValues["avg_temp"] ?? 0,
    };
  }, [data]);

  return (
    <Box
      w="496.666656px"
      h="302px"
      flex="0 0 auto"
    >
      <Box
        bg={cardBg}
        borderRadius="12px"
        p="16px"
        border={`1px solid ${cardBorder}`}
        h="100%"
        display="flex"
        flexDirection="column"
        gap="16px"
      >
        <Heading
          as="h3"
          size="sm"
          color={headingColor}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <span>Temperatures</span>
        </Heading>

        <Row
          title="Max. Cell temp"
          value={`${Number(
            values?.maxTemp || 0
          ).toFixed(2)} °C`}
          subLeft={`Cell ${
            values?.maxCellNo || "-"
          }`}
          subRight=""
          color="#F17A4B"
        />

        <Row
          title="Min. Cell temp"
          value={`${Number(
            values?.minTemp || 0
          ).toFixed(2)} °C`}
          subLeft={`Cell ${
            values?.minCellNo || "-"
          }`}
          subRight=""
          color="#599EF5"
        />

        <Row
          title="Average Cell temp"
          value={`${Number(
            values?.avgTemp || 0
          ).toFixed(2)} °C`}
          subLeft="-"
          subRight=""
          color="#D19CFF"
        />
      </Box>
    </Box>
  );
};

export default TemperatureCards;