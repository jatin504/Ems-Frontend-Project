import React from "react";
import {
  Box,
  Flex,
  HStack,
  Select,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const BatteryIntelligenceHeader = () => {
  const bg = useColorModeValue("#F8FAFC", "#071827");
  const border = useColorModeValue("#E2E8F0", "#1E3345");
  const text = useColorModeValue("gray.800", "white");
  const selectBg = useColorModeValue("white", "#0B1726");
  const optionText = useColorModeValue("black", "white");

  return (
    <Box
      w="100%"
      maxW="1920px"
      mx="auto"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      px={4}
      py={3}
      mb={3}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
        {/* Left */}
        <HStack spacing={3}>
          <Select
            w="250px"
            size="sm"
            color={text}
            bg="transparent"
            borderColor={border}
            icon={<ChevronDownIcon />}
          >
            <option style={{ color: "black" }}>
              Bank: Bank-01 (PCS-2 Bank 1)
            </option>
            <option style={{ color: "black" }}>
              Bank: Bank-02 (PCS-2 Bank 2)
            </option>
          </Select>

          <Select
            w="160px"
            size="sm"
            color={text}
            bg="transparent"
            borderColor={border}
            icon={<ChevronDownIcon />}
          >
            <option style={{ color: "black" }}>Rack-03</option>
            <option style={{ color: "black" }}>Rack-02</option>
            <option style={{ color: "black" }}>Rack-01</option>
          </Select>

          <Select
            w="160px"
            size="sm"
            color={text}
            bg="transparent"
            borderColor={border}
            icon={<ChevronDownIcon />}
          >
            <option style={{ color: "black" }}>All Modules</option>
            <option style={{ color: "black" }}>Module-01</option>
            <option style={{ color: "black" }}>Module-02</option>
          </Select>
        </HStack>

        {/* Right */}
        <HStack spacing={4}>
          <HStack spacing={2}>
            <Text fontSize="13px" color={text}>
              Auto Refresh
            </Text>

            <Switch colorScheme="green" defaultChecked />
          </HStack>

          <Select
            w="120px"
            size="sm"
            color={text}
            bg="transparent"
            borderColor={border}
            icon={<ChevronDownIcon />}
          >
            <option style={{ color: "black" }}>30 Days</option>
            <option style={{ color: "black" }}>7 Days</option>
            <option style={{ color: "black" }}>90 Days</option>
            <option style={{ color: "black" }}>1 Year</option>
          </Select>
        </HStack>
      </Flex>
    </Box>
  );
};

export default BatteryIntelligenceHeader;