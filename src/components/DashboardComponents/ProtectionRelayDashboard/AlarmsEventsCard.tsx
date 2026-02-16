// AlarmsEventsCard.tsx
import {
  Box,
  Flex,
  Text,
  VStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

const AlarmRow = ({
  time,
  source,
  level,
}: {
  time: string;
  source: string;
  level: "HIGH" | "INFO";
}) => {
  const levelColor = level === "HIGH" ? "red" : "blue";

  return (
    <Flex
      justify="space-between"
      align="center"
      fontSize="11px"
      bg={useColorModeValue("#EDF2F7", "#1A202C")}
      px={2}
      py={1}
      borderRadius="sm"
      overflow="hidden"              // ✅ safety
    >
      <Text minW="52px">{time}</Text>

      <Text
        flex="1"
        mx={2}
        isTruncated                 // ✅ long source safe
        whiteSpace="nowrap"
      >
        {source}
      </Text>

      <Badge colorScheme={levelColor} flexShrink={0}>
        {level}
      </Badge>
    </Flex>
  );
};

export default function AlarmsEventsCard() {
  const bg = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E2E8F0", "#4A5568");
  const titleColor = useColorModeValue("#2D3748", "#E2E8F0");

  return (
    <Box
      bg={bg}
      border={`1px solid ${borderColor}`}
      borderRadius="md"
      p={3}
      h="270px"
      display="flex"
      flexDirection="column"        // ✅ column layout
      overflow="hidden"             // ✅ prevent bleed
      mt="-28"
    >
      {/* Title */}
      <Flex justify="space-between" align="center">
        <Text fontSize="13px" fontWeight="bold" color={titleColor}>
          Alarms & Events
        </Text>
        <Text fontSize="14px">☰</Text>
      </Flex>

      <Box h="1px" bg={borderColor} my={2} />

      {/* 🔥 SCROLLABLE CONTENT */}
      <Box flex="1" overflowY="auto" pr={1}>
        <VStack spacing={2} align="stretch">
          <AlarmRow time="11:41:02" source="REF615-FDR-03" level="HIGH" />
          <AlarmRow time="11:32:48" source="ABB-REF615" level="INFO" />
          <AlarmRow time="11:32:15" source="ABB-REF615" level="INFO" />

          {/* Event-style rows */}
          <Text
            fontSize="11px"
            color="green.400"
            whiteSpace="normal"      // ✅ wrap allowed
            wordBreak="break-word"
          >
            ▶ 11:32:48 Protection Test Passed
          </Text>

          <Text
            fontSize="11px"
            color="green.400"
            whiteSpace="normal"
            wordBreak="break-word"
          >
            ▶ 11:32:15 Remote Command Received
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
