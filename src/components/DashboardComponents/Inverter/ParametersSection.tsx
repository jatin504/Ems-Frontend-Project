import React from "react";
import { Box, Flex, Text, Stack, useColorModeValue } from "@chakra-ui/react";

const ParametersSection: React.FC = () => {
  const sectionTitle = useColorModeValue("gray.800", "gray.100");
  const labelMuted = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      bg={useColorModeValue("white", "#161B1B")}
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      borderRadius="8px"
      p={4}
      alignSelf="flex-start"
    >
      <Text
        fontSize="14px"
        fontWeight="700"
        mb={2}
        color={sectionTitle}
        fontFamily="Poppins"
        bg={useColorModeValue(undefined, "#161B1B")}
        px={2}
        py={1}
        borderRadius="6px"
      >
        Parameters
      </Text>

      <Stack spacing={2} fontFamily="Poppins">
        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color={sectionTitle}>
            Status
          </Text>
          <Flex align="center">
            <Box width="10px" height="10px" borderRadius="50%" bg="green.500" mr={2} />
            <Text fontSize="12px" color={labelMuted}>
              Running
            </Text>
          </Flex>
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color={sectionTitle}>
            Alarm
          </Text>
          <Text fontSize="12px" color="green.400">
            OK
          </Text>
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color={sectionTitle}>
            Input DC Power
          </Text>
          <Text fontSize="13px">
            2111 kW
          </Text>
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color={sectionTitle}>
            Output AC Power
          </Text>
          <Text fontSize="13px">
            1988 kW
          </Text>
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color={sectionTitle}>
            Reactive Power
          </Text>
          <Text fontSize="13px">
            2563 kVAR
          </Text>
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color={sectionTitle}>
            Apparent Power
          </Text>
          <Text fontSize="13px">
            2010 kVA
          </Text>
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color={sectionTitle}>
            Reactive Power (2)
          </Text>
          <Text fontSize="13px">
            21 kVAR
          </Text>
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color={sectionTitle}>
            Yield Today
          </Text>
          <Text fontSize="13px">
            192 KWh
          </Text>
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color={sectionTitle}>
            Yield Lifetime
          </Text>
          <Text fontSize="13px">
            192 KWh
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
};

export default ParametersSection;