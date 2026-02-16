import React from "react";
import { Box, VStack, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

/* 40x40 circle + compact label */
function Bubble({ bg, label }: { bg: string; label: string }) {
  const textMuted = useColorModeValue("gray.500", "#A6B0B0");
  return (
    <VStack spacing="4px" minW="56px">
      <Box
        w="40px"
        h="40px"
        borderRadius="30px"
        bg={bg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex="0 0 40px"
        boxShadow="inset 0 0 0 2px rgba(255,255,255,0.1)"
      >
        <Text fontSize="sm" fontWeight="bold" color="white">
          4/5
        </Text>
      </Box>
      <Text
        fontSize="10px"
        lineHeight="12px"
        color={textMuted}
        textTransform="uppercase"
        letterSpacing="0.3px"
      >
        {label}
      </Text>
    </VStack>
  );
}

function POIPanel({
  title,
  colorsAndLabels,
}: {
  title: string;
  colorsAndLabels: [string, string, string];
}) {
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const pillBg = useColorModeValue("#e5e7eb", "#1d2323");
  const pillText = useColorModeValue("#111827", "#E8ECEC");

  return (
    <Box
      position="relative"
      w="197.5px"
      h="340px"   // 🔼 HEIGHT FURTHER INCREASED
      borderWidth="1px"
      borderColor={cardBorder}
      borderRadius="8px"
      p="12px"
      overflow="hidden"
    >
      {/* Pill */}
      <Box
        position="absolute"
        top="1px"
        left="1px"
        w="82px"
        h="26px"
        bg={pillBg}
        color={pillText}
        fontWeight="600"
        borderTopLeftRadius="7px"
        borderBottomRightRadius="8px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        pointerEvents="none"
      >
        <Box
          w="66px"
          h="18px"
          lineHeight="18px"
          textAlign="center"
          fontSize="11px"
          fontWeight={600}
        >
          {title}
        </Box>
      </Box>

      {/* content */}
      <VStack align="stretch" spacing="10px" pt="22px">
        {/* Row 1 */}
        <HStack justify="space-between">
          <Bubble bg={colorsAndLabels[0]} label="O1TOUP" />
          <Bubble bg={colorsAndLabels[1]} label="O1TOUP" />
          <Bubble bg={colorsAndLabels[2]} label="O1TOUP" />
        </HStack>

        {/* Row 2 */}
        <HStack justify="space-between">
          <Bubble bg={colorsAndLabels[1]} label="O1TOUP" />
          <Bubble bg={colorsAndLabels[2]} label="O1TOUP" />
          <Bubble bg={colorsAndLabels[0]} label="O1TOUP" />
        </HStack>

        {/* 🔽 NEW: Row 3 (same circle style) */}
        <HStack justify="space-between">
          <Bubble bg={colorsAndLabels[0]} label="O1TOUP" />
          <Bubble bg={colorsAndLabels[1]} label="O1TOUP" />
          <Bubble bg={colorsAndLabels[2]} label="O1TOUP" />
        </HStack>

        {/* 🔽 NEW: Row 4 (same circle style) */}
        <HStack justify="space-between">
          <Bubble bg={colorsAndLabels[1]} label="O1TOUP" />
          <Bubble bg={colorsAndLabels[2]} label="O1TOUP" />
          <Bubble bg={colorsAndLabels[0]} label="O1TOUP" />
        </HStack>
      </VStack>
    </Box>
  );
}

/* tiny status dot */
const SmallDot = ({ color }: { color: string }) => (
  <Box w="8px" h="8px" borderRadius="full" bg={color} />
);

function ActiveAlarmBlock() {
  const titleCol = useColorModeValue("gray.800", "#E8ECEC");
  const itemCol = useColorModeValue("gray.700", "#CFD6D6");
  const bottomCol = useColorModeValue("gray.600", "#B7C0C0");

  return (
    <Box
      w="197.5px"
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Box>
        <Text fontSize="sm" color={titleCol} mb="8px">
          Active alarm
        </Text>
        <VStack align="stretch" spacing="6px">
          <HStack spacing="8px">
            <SmallDot color="#f59e0b" />
            <Text fontSize="12px" color={itemCol}>Overtemperature</Text>
          </HStack>
          <HStack spacing="8px">
            <SmallDot color="#a78bfa" />
            <Text fontSize="12px" color={itemCol}>High SoC Limit</Text>
          </HStack>
          <HStack spacing="8px">
            <SmallDot color="#fb7185" />
            <Text fontSize="12px" color={itemCol}>Isolation fault</Text>
          </HStack>
          <HStack spacing="8px">
            <SmallDot color="#f59e0b" />
            <Text fontSize="12px" color={itemCol}>Overtemperature</Text>
          </HStack>
          <HStack spacing="8px">
            <SmallDot color="#a78bfa" />
            <Text fontSize="12px" color={itemCol}>High SoC Limit</Text>
          </HStack>
          <HStack spacing="8px">
            <SmallDot color="#f87171" />
            <Text fontSize="12px" color={itemCol}>Grid Fault</Text>
          </HStack>
          <HStack spacing="8px">
            <SmallDot color="#60a5fa" />
            <Text fontSize="12px" color={itemCol}>Low Voltage</Text>
          </HStack>
          <HStack spacing="8px">
            <SmallDot color="#fbbf24" />
            <Text fontSize="12px" color={itemCol}>Communication Error</Text>
          </HStack>
          <HStack spacing="8px">
            <SmallDot color="#34d399" />
            <Text fontSize="12px" color={itemCol}>Fan Failure</Text>
          </HStack>
        </VStack>
      </Box>

      <Box flex="1" /> {/* Yeh box status row ko bottom par chipka dega */}

      <HStack pt="10px" spacing="14px" justify="center">
        <HStack spacing="6px">
          <SmallDot color="#22c55e" />
          <Text fontSize="12px" color={bottomCol}>Charging</Text>
        </HStack>
        <HStack spacing="6px">
          <SmallDot color="#ef4444" />
          <Text fontSize="12px" color={bottomCol}>Discharging</Text>
        </HStack>
        <HStack spacing="6px">
          <SmallDot color="#22d3ee" />
          <Text fontSize="12px" color={bottomCol}>Idle</Text>
        </HStack>
      </HStack>
    </Box>
  );
}

export default function SystemOverview() {
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w="447px"
      h="490px"
      p="16px"
    >
      <VStack align="stretch" spacing="12px">
        <Text fontSize="16px" fontWeight={500}>System Overview</Text>

        <HStack
          justify="space-between"
          align="stretch"
          alignItems="stretch" // yahan "stretch"
          h="340px"            // yahan height fix
        >
          <POIPanel
            title="POI meter 1"
            colorsAndLabels={["gray.300", "#32D975", "#D72F5C"]}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            h="100%" // yahan 100%
            justifyContent="flex-start"
          >
            <ActiveAlarmBlock />
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}
