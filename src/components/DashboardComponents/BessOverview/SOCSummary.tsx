import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import WidgetTitle from "../../Common/WidgetTitle";

const SOCSummary = () => {
  const bg = useColorModeValue("#FFFFFF", "#071C2C");

  const border = useColorModeValue(
    "rgba(15,23,42,0.08)",
    "rgba(255,255,255,0.08)"
  );

  const textColor = useColorModeValue("#0F172A", "#FFFFFF");

  const subColor = useColorModeValue(
    "#475569",
    "rgba(255,255,255,0.65)"
  );

  const lineColor = useColorModeValue("#CBD5E1", "#475569");

  return (
    <Box
      bg={bg}
      borderRadius="12px"
      p={3}
      border={`1px solid ${border}`}
      w="100%"
      h="120px"
      overflow="hidden"
    >
      {/* TITLE */}
      <Box mb={1}>
        <WidgetTitle color={textColor}>
          SOC Summary
        </WidgetTitle>
      </Box>

      {/* GAUGE */}
      <Box
        position="relative"
        w="100%"
        h="76px"
        mt={1}
      >
        {/* ================= SCALE VALUES ================= */}
        <Text
          position="absolute"
          left="7%"
          top="0"
          transform="translateX(-50%)"
          fontSize="8px"
          color={subColor}
        >
          0%
        </Text>

        <Text
          position="absolute"
          left="27%"
          top="0"
          transform="translateX(-50%)"
          fontSize="8px"
          color={subColor}
        >
          10%
        </Text>

        <Text
          position="absolute"
          left="77%"
          top="0"
          transform="translateX(-50%)"
          fontSize="8px"
          color={subColor}
        >
          90%
        </Text>

        <Text
          position="absolute"
          right="3%"
          top="0"
          transform="translateX(50%)"
          fontSize="8px"
          color={subColor}
        >
          100%
        </Text>

        {/* ================= GAUGE LINE ================= */}

        {/* LEFT DASHED SECTION */}
        <Box
          position="absolute"
          left="7%"
          width="20%"
          top="25px"
          borderTop="2px dashed"
          borderColor={lineColor}
        />

        {/* MAIN ACTIVE SECTION */}
        <Box
          position="absolute"
          left="27%"
          width="50%"
          top="25px"
          h="2px"
          bg={lineColor}
        />

        {/* RIGHT DASHED SECTION */}
        <Box
          position="absolute"
          left="77%"
          width="20%"
          top="25px"
          borderTop="2px dashed"
          borderColor={lineColor}
        />

        {/* ================= TICKS ================= */}

        {/* 0% */}
        <Box
          position="absolute"
          left="7%"
          top="19px"
          h="13px"
          borderLeft="1px solid"
          borderColor={subColor}
        />

        {/* 10% */}
        <Box
          position="absolute"
          left="27%"
          top="19px"
          h="13px"
          borderLeft="2px solid"
          borderColor={textColor}
        />

        {/* 90% */}
        <Box
          position="absolute"
          left="77%"
          top="19px"
          h="13px"
          borderLeft="2px solid"
          borderColor={textColor}
        />

        {/* 100% */}
        <Box
          position="absolute"
          right="3%"
          top="19px"
          h="13px"
          borderLeft="1px solid"
          borderColor={subColor}
        />

        {/* ================= RESERVE ================= */}

        <Text
          position="absolute"
          left="27%"
          top="35px"
          transform="translateX(-50%)"
          fontSize="8px"
          fontWeight="600"
          color={subColor}
        >
          Reserve
        </Text>

        {/* ================= MAX ================= */}

        <Text
          position="absolute"
          left="77%"
          top="35px"
          transform="translateX(-50%)"
          fontSize="8px"
          fontWeight="600"
          color={subColor}
        >
          Max
        </Text>

        {/* ================= CURRENT SOC ================= */}

        {/* Marker */}
        <Box
          position="absolute"
          left="72.4%"
          top="17px"
          transform="translateX(-50%)"
          w="9px"
          h="9px"
          borderRadius="50%"
          bg="#2563EB"
          border="2px solid white"
          boxShadow="0 1px 5px rgba(37,99,235,0.35)"
        />

        {/* Triangle */}
        <Box
          position="absolute"
          left="72.4%"
          top="38px"
          transform="translateX(-50%)"
          w="0"
          h="0"
          borderLeft="4px solid transparent"
          borderRight="4px solid transparent"
          borderBottom="6px solid #2563EB"
        />

        {/* Value */}
        <Text
          position="absolute"
          left="72.4%"
          top="48px"
          transform="translateX(-50%)"
          fontSize="9px"
          fontWeight="700"
          color="#2563EB"
          whiteSpace="nowrap"
        >
          72.4%
        </Text>
      </Box>
    </Box>
  );
};

export default SOCSummary;