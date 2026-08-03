import React from "react";
import { Box, Flex, Text, Heading, useColorModeValue } from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  bankId?: string;
};

const VOLT = "#06b6d4";
const CURR = "#a855f7";

type RowProps = {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  leftColor?: string;
  rightColor?: string;
};

const Row: React.FC<RowProps> = ({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  leftColor = VOLT,
  rightColor = CURR,
}) => (
  <Flex w="100%" h="18px" align="center" justify="space-between" gap="10px">
    <Flex w="150px" justify="space-between">
      <Text fontSize="sm" color="gray.400" whiteSpace="nowrap">
        {leftLabel}
      </Text>
      <Text fontSize="sm" color={leftColor} fontWeight={600} whiteSpace="nowrap">
        {leftValue}
      </Text>
    </Flex>
    <Flex w="150px" justify="space-between">
      <Text fontSize="sm" color="gray.400" whiteSpace="nowrap">
        {rightLabel}
      </Text>
      <Text fontSize="sm" color={rightColor} fontWeight={600} whiteSpace="nowrap">
        {rightValue}
      </Text>
    </Flex>
  </Flex>
);

const AnalogBlock: React.FC<{
  id: string;
  maxV: string;
  minV: string;
  avgV: string;
  maxC: string;
  minC: string;
  avgC: string;
}> = ({ id, maxV, minV, avgV, maxC, minC, avgC }) => {
  const innerBg = useColorModeValue("#ffffff", "#0e141d");
  const innerBorder = useColorModeValue("#e5e7eb", "#1c2635");

  return (
    <Box
      w="100%"
      h="108px"
      bg={innerBg}
      border={`1px solid ${innerBorder}`}
      borderRadius="12px"
      p="12px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      flex="0 0 auto"
    >
      <Text fontWeight="semibold" fontSize="sm" lineHeight="1" whiteSpace="nowrap">
        {id}
      </Text>

      <Row leftLabel="Max. voltage" leftValue={maxV} rightLabel="Max. current" rightValue={maxC} />
      <Row leftLabel="Min. voltage" leftValue={minV} rightLabel="Min. current" rightValue={minC} />
      <Row leftLabel="Avg. voltage" leftValue={avgV} rightLabel="Avg. current" rightValue={avgC} />
    </Box>
  );
};

const AnalogsCard: React.FC<Props> = ({
  bankId,
}) => {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#000000", "gray.300");

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
          key: "max_cell_voltage",
          alias: "max_voltage",
          keyType: "common",
        },
        {
          key: "min_cell_voltage",
          alias: "min_voltage",
          keyType: "common",
        },
        {
          key: "avg_cell_voltage",
          alias: "avg_voltage",
          keyType: "common",
        },

        {
          key: "max_cell_temperature",
          alias: "max_temp",
          keyType: "common",
        },
        {
          key: "min_cell_temperature",
          alias: "min_temp",
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

    if (!deviceId) return null;

    const d = (data as any)[deviceId];

    const getLast = (key: string) => {
      const arr = d?.[key] || [];

      return arr.length
        ? arr[arr.length - 1]?.value
        : 0;
    };

    return {
      maxVoltage: getLast("max_voltage"),
      minVoltage: getLast("min_voltage"),
      avgVoltage: getLast("avg_voltage"),

      maxTemp: getLast("max_temp"),
      minTemp: getLast("min_temp"),
      avgTemp: getLast("avg_temp"),
    };
  }, [data]);

  // Add as many blocks as you want — scroll will appear automatically
  const BLOCKS = values
    ? [
        {
          id: "Voltage",

          maxV: `${Number(
            values.maxVoltage
          ).toFixed(2)} V`,

          minV: `${Number(
            values.minVoltage
          ).toFixed(2)} V`,

          avgV: `${Number(
            values.avgVoltage
          ).toFixed(2)} V`,

          maxC: "-",
          minC: "-",
          avgC: "-",
        },

        {
          id: "Temperature",

          maxV: `${Number(
            values.maxTemp
          ).toFixed(2)} °C`,

          minV: `${Number(
            values.minTemp
          ).toFixed(2)} °C`,

          avgV: `${Number(
            values.avgTemp
          ).toFixed(2)} °C`,

          maxC: "-",
          minC: "-",
          avgC: "-",
        },
      ]
    : [];

  return (
    <Box w="376px" h="304px" flex="0 0 auto" overflow="hidden">
      <Box
        bg={cardBg}
        borderRadius="lg"
        p={4}
        border={`1px solid ${cardBorder}`}
        h="100%"
        display="flex"
        flexDirection="column"
        minH={0} // important so inner scroll works
      >
        {/* fixed header */}
        <Heading
          as="h3"
          size="sm"
          color={headingColor}
          mb={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flex="0 0 auto"
        >
          <span>Analogs</span>
        </Heading>

        {/* scrollable list */}
        <Box
          flex="1 1 auto"
          minH={0}
          display="flex"
          flexDirection="column"
          gap="16px"
          overflowY="auto"
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { background: "#3a3f44", borderRadius: "8px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
          }}
        >
          {BLOCKS.map((b) => (
            <AnalogBlock
              key={b.id}
              id={b.id}
              maxV={b.maxV}
              minV={b.minV}
              avgV={b.avgV}
              maxC={b.maxC}
              minC={b.minC}
              avgC={b.avgC}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AnalogsCard;
