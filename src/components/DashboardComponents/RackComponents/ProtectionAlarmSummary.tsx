import React from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Badge,
  Divider,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  BellIcon,
  WarningTwoIcon,
  InfoOutlineIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";

const alarmSummary = [
  {
    label: "Critical",
    value: 0,
    color: "#EF4444",
    icon: BellIcon,
    bg: "rgba(239,68,68,0.08)",
  },
  {
    label: "Major",
    value: 1,
    color: "#F59E0B",
    icon: WarningTwoIcon,
  },
  {
    label: "Minor",
    value: 2,
    color: "#FACC15",
    icon: WarningTwoIcon,
  },
  {
    label: "Info",
    value: 3,
    color: "#3B82F6",
    icon: InfoOutlineIcon,
  },
];

const protectionStatus = [
  { name: "Module Over Voltage", status: "Normal", color: "#67C23A" },
  { name: "Module Under Voltage", status: "Normal", color: "#67C23A" },
  { name: "Cell Over Temperature", status: "Warning", color: "#F59E0B" },
  { name: "Cell Under Temperature", status: "Normal", color: "#67C23A" },
  { name: "Rack Over Temperature", status: "Normal", color: "#67C23A" },
  { name: "Insulation Fault", status: "Normal", color: "#67C23A" },
  { name: "Fuse Fault", status: "Normal", color: "#67C23A" },
  { name: "Contactor Fault", status: "Normal", color: "#67C23A" },
];

const safetyStatus = [
  { name: "Smoke Detection", status: "Normal", color: "#67C23A" },
  { name: "Water Leakage", status: "Normal", color: "#67C23A" },
  { name: "Door Open", status: "Normal", color: "#67C23A" },
  { name: "HVIL", status: "Closed", color: "#67C23A" },
  { name: "Precharge Circuit", status: "OK", color: "#67C23A" },
  { name: "Ground Fault", status: "Normal", color: "#67C23A" },
];

export default function ProtectionAlarmSummary() {
  const bg = useColorModeValue("#FFFFFF", "#0F1B26");
  const border = useColorModeValue("#D8E2EE", "#263849");
  const title = useColorModeValue("#1E293B", "#F8FAFC");
  const text = useColorModeValue("#475569", "#CBD5E1");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      h="360px"
      overflow="hidden"
    >
      <Flex
        h="38px"
        px="12px"
        align="center"
        borderBottom="1px solid"
        borderColor={border}
      >
        <Text
          fontSize="15px"
          fontWeight="700"
          color={title}
        >
          Protection & Alarm Summary
        </Text>
      </Flex>

      <Box px="12px" pt="8px" pb="6px">

        {/* Alarm Counters */}

        <Box mb={2}>
          <Flex align="stretch">
            {alarmSummary.map((item, index) => (
              <React.Fragment key={item.label}>
                <Flex
                  flex="1"
                  align="center"
                  justify="center"
                  py={1}
                >
                  <HStack spacing={2}>
                    <Box
                      w="34px"
                      h="28px"
                      borderRadius="8px"
                      border="1px solid"
                      borderColor={
                        item.label === "Critical"
                          ? "rgba(239,68,68,0.25)"
                          : "transparent"
                      }
                      bg={item.bg ?? "transparent"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon
                        as={item.icon}
                        boxSize={5}
                        color={item.color}
                      />
                    </Box>

                    <VStack spacing={0} align="start">
                      <Text
                        fontSize="24px"
                        lineHeight="22px"
                        fontWeight="500"
                        color={title}
                      >
                        {item.value}
                      </Text>

                      <Text
                        fontSize="11px"
                        color={text}
                      >
                        {item.label}
                      </Text>
                    </VStack>
                  </HStack>
                </Flex>

                {index !== alarmSummary.length - 1 && (
                  <Divider
                    orientation="vertical"
                    h="42px"
                    borderColor={border}
                  />
                )}
              </React.Fragment>
            ))}
          </Flex>
        </Box>

        <Divider my={2} />

        {/* Protection Status */}

        <Box mt={2}>
          <Flex align="flex-start">
            {/* Left */}
            <Box flex="1" pr={4}>
              <Text
                fontSize="13px"
                fontWeight="700"
                color={title}
                mb={2}
              >
                Protection Status
              </Text>

              <VStack spacing={1} align="stretch">
                {protectionStatus.map((item) => (
                  <Flex
                    key={item.name}
                    justify="space-between"
                    align="center"
                  >
                    <HStack spacing={2}>
                      <CheckCircleIcon color={item.color} boxSize={3} />
                      <Text fontSize="11px" color={text}>
                        {item.name}
                      </Text>
                    </HStack>

                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={item.color}
                    >
                      {item.status}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>

            {/* Vertical Divider */}
            <Divider
              orientation="vertical"
              alignSelf="stretch"
              borderColor={border}
            />

            {/* Right */}
            <Box flex="1" pl={4}>
              <Text
                fontSize="13px"
                fontWeight="700"
                color={title}
                mb={2}
              >
                Safety Status
              </Text>

              <VStack spacing={1} align="stretch">
                {safetyStatus.map((item) => (
                  <Flex
                    key={item.name}
                    justify="space-between"
                    align="center"
                  >
                    <HStack spacing={2}>
                      {item.status === "Standby" ? (
                        <InfoOutlineIcon color={item.color} boxSize={3} />
                      ) : (
                        <CheckCircleIcon color={item.color} boxSize={3} />
                      )}

                      <Text fontSize="11px" color={text}>
                        {item.name}
                      </Text>
                    </HStack>

                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={item.color}
                    >
                      {item.status}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </Flex>
        </Box>

        {/* Footer */}

        <Text
          mt={2}
          textAlign="center"
          fontSize="11px"
          color={text}
          cursor="pointer"
          _hover={{
            color: "#3182CE",
            textDecoration: "underline",
          }}
        >
          Click any item for detailed diagnostics →
        </Text>

      </Box>
    </Box>
  );
}