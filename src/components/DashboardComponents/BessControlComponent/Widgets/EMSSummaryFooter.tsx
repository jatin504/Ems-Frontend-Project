import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function EMSSummaryFooter() {
  const primaryColor = useColorModeValue("#111827", "#E8ECEC");
  const secondaryColor = useColorModeValue("#64748B", "#A6B0B0");
  const cardBg = useColorModeValue("#FFFFFF", "#0F1414");
  const cardBorder = useColorModeValue("gray.200", "#202525");

  return (
    <Box
      w="full"
      h="86px"
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      overflow="hidden"
    >
      <HStack
        align="center"
        w="full"
        h="full"
        px="16px"
        spacing="0"
      >
        {/* Current EMS Objective */}
        <Box
          flex="1"
          minW={0}
          pr="28px"
          borderRight="1px solid"
          borderColor="gray.200"
        >
          <Text
            fontSize="12px"
            fontWeight="700"
            color={primaryColor}
            mb="3px"
          >
            Current EMS Objective
          </Text>

          <HStack justify="space-between">
            <VStack align="start" spacing="1px">
              <Text
                fontSize="11px"
                fontWeight="700"
                color="green.500"
              >
                Peak Shaving
              </Text>

              <Text
                fontSize="9px"
                color={secondaryColor}
              >
                Target: POI ≤ 80 MW
              </Text>
            </VStack>

            <VStack align="end" spacing="1px">
              <Text
                fontSize="9px"
                color={secondaryColor}
              >
                Current
              </Text>

              <Text
                fontSize="11px"
                fontWeight="700"
                color={primaryColor}
              >
                73.8 MW
              </Text>

              <Text
                fontSize="9px"
                fontWeight="700"
                color="green.500"
              >
                +6.2 MW margin
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Energy Arbitrage */}
        <Box
          flex="1"
          minW={0}
          px="28px"
          borderRight="1px solid"
          borderColor="gray.200"
        >
          <Text
            fontSize="12px"
            fontWeight="700"
            color={primaryColor}
            mb="7px"
          >
            Energy Arbitrage
          </Text>

          <HStack justify="space-between">
            <Text fontSize="9px" color={secondaryColor}>
              Charge
            </Text>

            <Text
              fontSize="10px"
              fontWeight="700"
              color={primaryColor}
            >
              ₹5.2/kWh
            </Text>
          </HStack>

          <HStack justify="space-between" mt="4px">
            <Text fontSize="9px" color={secondaryColor}>
              Discharge threshold
            </Text>

            <Text
              fontSize="10px"
              fontWeight="700"
              color={primaryColor}
            >
              ₹8.1/kWh
            </Text>
          </HStack>
        </Box>

        {/* Zero Export */}
        <Box
          flex="1"
          minW={0}
          px="28px"
          borderRight="1px solid"
          borderColor="gray.200"
        >
          <HStack
            justify="space-between"
            mb="7px"
          >
            <Text
              fontSize="12px"
              fontWeight="700"
              color={primaryColor}
            >
              Zero Export
            </Text>

            <Box
              w="7px"
              h="7px"
              borderRadius="full"
              bg="green.400"
            />
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="9px" color={secondaryColor}>
              Export limit
            </Text>

            <Text
              fontSize="10px"
              fontWeight="700"
              color={primaryColor}
            >
              0 MW
            </Text>
          </HStack>

          <HStack justify="space-between" mt="4px">
            <Text fontSize="9px" color={secondaryColor}>
              Actual export
            </Text>

            <Text
              fontSize="10px"
              fontWeight="700"
              color="orange.400"
            >
              0.03 MW
            </Text>
          </HStack>
        </Box>

        {/* DSM */}
        <Box
          flex="1"
          minW={0}
          pl="28px"
        >
          <Text
            fontSize="12px"
            fontWeight="700"
            color={primaryColor}
            mb="7px"
          >
            DSM
          </Text>

          <HStack justify="space-between">
            <Text fontSize="9px" color={secondaryColor}>
              Scheduled reduction
            </Text>

            <Text
              fontSize="10px"
              fontWeight="700"
              color={primaryColor}
            >
              15 MW
            </Text>
          </HStack>

          <HStack justify="space-between" mt="4px">
            <Text fontSize="9px" color={secondaryColor}>
              Delivered reduction
            </Text>

            <Text
              fontSize="10px"
              fontWeight="700"
              color="green.500"
            >
              14.7 MW
            </Text>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
}