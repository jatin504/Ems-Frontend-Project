import React from "react";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  CheckCircleIcon,
  TimeIcon,
  ViewIcon,
  WarningIcon,
} from "@chakra-ui/icons";

export default function ModuleStatusCard() {
  const bg = useColorModeValue(
    "linear-gradient(180deg,#F8FAFC 0%,#EAF4FF 100%)",
    "linear-gradient(180deg,#102537 0%,#0C1C2A 100%)"
  );

  const border = useColorModeValue("#CBD5E1", "#183448");
  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const label = useColorModeValue("#475569", "#C4CFD9");

  return (
    <Box
      w="360px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      overflow="hidden"
      boxShadow="0 6px 16px rgba(0,0,0,0.08)"
    >
      {/* Header */}
      <Box px="18px" py="16px">
        <Text
          color={title}
          fontSize="22px"
          fontWeight="700"
        >
          Module Status
        </Text>
      </Box>

      <Divider borderColor={useColorModeValue("#CBD5E1", "#1D3A50")} />

      <VStack
        spacing="18px"
        align="stretch"
        px="18px"
        py="18px"
      >
        {/* Communication */}
        <Flex justify="space-between" align="center">
          <HStack spacing="10px">
            <CheckCircleIcon color="#5BC236" boxSize={4} />
            <Text color={label} fontSize="15px">
              Communication
            </Text>
          </HStack>

          <Text
            color="#5BC236"
            fontWeight="700"
            fontSize="16px"
          >
            Online
          </Text>
        </Flex>

        {/* Module State */}
        <Flex justify="space-between" align="center">
          <HStack spacing="10px">
            <ViewIcon color="#55B7FF" boxSize={4} />
            <Text color={label} fontSize="15px">
              Module State
            </Text>
          </HStack>

          <Text
            color="#55B7FF"
            fontWeight="700"
            fontSize="16px"
          >
            Discharging
          </Text>
        </Flex>

        {/* Balance */}
        <Flex justify="space-between" align="center">
          <HStack spacing="10px">
            <WarningIcon color="#E5E7EB" boxSize={4} />
            <Text color={label} fontSize="15px">
              Balance Status
            </Text>
          </HStack>

          <Text
            color="#74D13D"
            fontWeight="700"
            fontSize="16px"
          >
            Balanced
          </Text>
        </Flex>

        {/* Health */}
        <Flex justify="space-between" align="center">
          <HStack spacing="10px">
            <CheckCircleIcon color="#5BC236" boxSize={4} />
            <Text color={label} fontSize="15px">
              Health Status
            </Text>
          </HStack>

          <HStack spacing="6px">
            <CheckCircleIcon color="#5BC236" boxSize={5} />
            <Text
              color="#5BC236"
              fontWeight="700"
              fontSize="16px"
            >
              Good
            </Text>
          </HStack>
        </Flex>

        <Divider borderColor="#1D3A50" mt="6px" />

        {/* Last Update */}
        <Flex justify="space-between" align="center">
          <HStack spacing="8px">
            <TimeIcon color="#A7B7C7" boxSize={4} />
            <Text
              color="#A7B7C7"
              fontSize="15px"
            >
              Last Update
            </Text>
          </HStack>

          <Text
            color="#F8FAFC"
            fontWeight="600"
            fontSize="15px"
          >
            10 Jul 2026&nbsp;&nbsp;11:28:45
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
}