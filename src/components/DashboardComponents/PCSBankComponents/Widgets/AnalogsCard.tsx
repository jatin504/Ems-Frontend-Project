import React from "react";
import { Box, Flex, Text, Heading, useColorModeValue } from "@chakra-ui/react";

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

const AnalogsCard: React.FC = () => {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#000000", "gray.300");

  // Add as many blocks as you want — scroll will appear automatically
  const BLOCKS = [
    {
      id: "String ID 6",
      maxV: "606.40 V",
      minV: "606.40 V",
      avgV: "606.40 V",
      maxC: "0.00 A",
      minC: "0.00 A",
      avgC: "0.00 A",
    },
    {
      id: "String ID 7",
      maxV: "606.40 V",
      minV: "606.40 V",
      avgV: "606.40 V",
      maxC: "0.00 A",
      minC: "0.00 A",
      avgC: "0.00 A",
    },
    // add more to see vertical scroll:
    // {
    //   id: "String ID 8",
    //   maxV: "606.40 V",
    //   minV: "606.40 V",
    //   avgV: "606.40 V",
    //   maxC: "0.00 A",
    //   minC: "0.00 A",
    //   avgC: "0.00 A",
    // },
  ];

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
