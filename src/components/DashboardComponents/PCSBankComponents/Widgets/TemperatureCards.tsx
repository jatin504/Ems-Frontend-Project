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
  const rowBg = useColorModeValue("#f1f5f9", "#0e141d");
  const rowBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const titleColor = useColorModeValue("#0f172a", "gray.300");
  const subColor = useColorModeValue("#94a3b8", "gray.500");

  return (
    <Box
      w="328px"
      h="66px"
      bg={rowBg}
      border={`1px solid ${rowBorder}`}
      borderRadius="8px"
      p="12px"
    >
      <Flex align="center" justify="space-between" w="100%">
        <Box w="152px" h="21px" overflow="hidden">
          <Text
            fontFamily="'Poppins', sans-serif"
            fontWeight={400}
            fontSize="14px"
            color={titleColor}
            noOfLines={1}
          >
            {title}
          </Text>
        </Box>

        <Box
          w="136px"
          h="43px"
          display="flex"
          flexDir="column"
          gap="4px"
        >
          <Text
            textAlign="right"
            fontFamily="'Poppins', sans-serif"
            fontWeight={600}
            fontSize="16px"
            color={color}
          >
            {value}
          </Text>

          <Flex justify="space-between" align="center">
            <Text
              fontFamily="'Poppins', sans-serif"
              fontWeight={400}
              fontSize="12px"
              color={subColor}
            >
              {subLeft}
            </Text>

            <Text
              fontFamily="'Poppins', sans-serif"
              fontWeight={400}
              fontSize="12px"
              color={subColor}
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
  bankId?: string;
};

const TemperatureCards: React.FC<Props> = ({
  bankId,
}) => {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#0f172a", "gray.300");

  const { data, fetchData } =
    useTimeseriesData();

  React.useEffect(() => {
    if (!bankId) return;

    const match =
      bankId.match(/pcs_(\d+)_bank_(\d+)/);

    if (!match) return;

    const pcsNo = match[1];
    const bankNo = match[2];

    fetchData({
      devices: {
        ids: [
          `plant_1_pcs_${pcsNo}_bank_bank_${bankNo}`,
        ],
        patterns: [],
      },

      keys: [
        {
          key: "max_cell_temperature",
          alias: "max_temp",
          keyType: "common",
        },
        {
          key: "rack_number_of_max_cell_temperature",
          alias: "max_rack",
          keyType: "common",
        },
        {
          key: "module_number_of_max_cell_temperature",
          alias: "max_module",
          keyType: "common",
        },

        {
          key: "min_cell_temperature",
          alias: "min_temp",
          keyType: "common",
        },
        {
          key: "rack_number_of_min_cell_temperature",
          alias: "min_rack",
          keyType: "common",
        },
        {
          key: "module_number_of_min_cell_temperature",
          alias: "min_module",
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
  }, [bankId]);

  const values = React.useMemo(() => {
    const deviceId =
      Object.keys(data || {})[0];

    if (!deviceId) {
      return {
        maxTemp: 0,
        maxRack: "-",
        maxModule: "-",
        minTemp: 0,
        minRack: "-",
        minModule: "-",
        avgTemp: 0,
      };
    }

    const d = (data as any)[deviceId];

    const getLast = (key: string) => {
      const arr = d?.[key] || [];

      return arr.length
        ? arr[arr.length - 1]?.value
        : 0;
    };

    return {
      maxTemp: getLast("max_temp"),
      maxRack: getLast("max_rack"),
      maxModule: getLast("max_module"),

      minTemp: getLast("min_temp"),
      minRack: getLast("min_rack"),
      minModule: getLast("min_module"),

      avgTemp: getLast("avg_temp"),
    };
  }, [data]);

  return (
    <Box w="360px" h="302px" flex="0 0 auto">
      <Box
        bg={cardBg}
        borderRadius="lg"
        p={4}
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
          mb={1}
        >
          Temperatures
        </Heading>

        <Row
          title="Max. Module temp"
          value={`${Number(
            values.maxTemp || 0
          ).toFixed(2)} °C`}
          subLeft={`Rack ${values.maxRack}`}
          subRight={`Module ${values.maxModule}`}
          color="#ff7a45"
        />

        <Row
          title="Min. Module temp"
          value={`${Number(
            values.minTemp || 0
          ).toFixed(2)} °C`}
          subLeft={`Rack ${values.minRack}`}
          subRight={`Module ${values.minModule}`}
          color="#3b82f6"
        />

        <Row
          title="Average Module temp"
          value={`${Number(
            values.avgTemp || 0
          ).toFixed(2)} °C`}
          subLeft="-"
          subRight="-"
          color="#a855f7"
        />
      </Box>
    </Box>
  );
};

export default TemperatureCards;