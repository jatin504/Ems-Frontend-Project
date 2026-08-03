import React from "react";
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  HStack,
  Progress,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const CellBalancingStatus = () => {
  const bg = useColorModeValue(
    "linear-gradient(180deg,#F8FAFC 0%,#EAF4FF 100%)",
    "linear-gradient(180deg,#102537 0%,#0C1C2A 100%)"
  );

  const border = useColorModeValue("#D1E3F5", "#1C3C52");
  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const text = useColorModeValue("#334155", "#E2E8F0");
  const sub = useColorModeValue("#64748B", "#94A3B8");

  return (
    <Box
      w="550px"
      h="245px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p="18px"
    >
      <Text
        fontSize="18px"
        fontWeight="700"
        color={title}
        mb={4}
      >
        Cell Balancing Status
      </Text>

      <HStack
        align="stretch"
        spacing={0}
        h="170px"
      >
        {/* Left */}
        <HStack
          flex="0 0 58%"
          spacing={5}
          align="center"
          px={2}
        >
          <CircularProgress
            value={96}
            size="110px"
            thickness="14px"
            color="#65B32E"
            trackColor={useColorModeValue("#E5E7EB","#1B2A36")}
          >
            <CircularProgressLabel>
              <Text
                fontSize="36px"
                fontWeight="700"
                lineHeight="1"
              >
                25
              </Text>

              <Text
                fontSize="13px"
                color={sub}
              >
                Total Cells
              </Text>
            </CircularProgressLabel>
          </CircularProgress>

          <VStack
            align="start"
            spacing={2}
          >
            <HStack justify="space-between" w="170px">
              <HStack>
                <Box w="12px" h="12px" bg="#65B32E" borderRadius="full" />
                <Text fontSize="13px" color={text}>Balanced</Text>
              </HStack>

              <Text fontSize="13px" color={text}>24 (96%)</Text>
            </HStack>

            <HStack justify="space-between" w="170px">
              <HStack>
                <Box w="12px" h="12px" bg="#F59E0B" borderRadius="full" />
                <Text fontSize="13px" color={text}>Balancing</Text>
              </HStack>

              <Text fontSize="13px" color={text}>1 (4%)</Text>
            </HStack>

            <HStack justify="space-between" w="170px">
              <HStack>
                <Box w="12px" h="12px" bg="#EF4444" borderRadius="full" />
                <Text fontSize="13px" color={text}>Not Balanced</Text>
              </HStack>

              <Text fontSize="13px" color={text}>0 (0%)</Text>
            </HStack>

            <HStack justify="space-between" w="170px">
              <HStack>
                <Box w="12px" h="12px" bg="#9CA3AF" borderRadius="full" />
                <Text fontSize="13px" color={text}>Offline</Text>
              </HStack>

              <Text fontSize="13px" color={text}>0 (0%)</Text>
            </HStack>
          </VStack>
        </HStack>

        <Divider
          orientation="vertical"
          borderColor={border}
          h="165px"
        />
                {/* Right */}
        <Box
          flex="0 0 42%"
          px={4}
          pb={3}
        >
          <Text
            fontSize="15px"
            fontWeight="700"
            color={title}
            mb={2}
            whiteSpace="nowrap"
          >
            Balancing Information
          </Text>

          <VStack
            align="stretch"
            spacing={2}
          >
            <Flex
              justify="space-between"
              align="center"
              gap={4}
            >
              <Text
                fontSize="13px"
                color={sub}
                whiteSpace="nowrap"
              >
                Active Cells
              </Text>
              <Text
                fontSize="13px"
                color={text}
                fontWeight="600"
                whiteSpace="nowrap"
              >
                1
              </Text>
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              gap={4}
            >
              <Text
                fontSize="13px"
                color={sub}
                whiteSpace="nowrap"
              >
                Balancing Current
              </Text>
              <Text
                fontSize="13px"
                color={text}
                fontWeight="600"
                whiteSpace="nowrap"
              >
                0.45 A
              </Text>
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              gap={4}
            >
              <Text
                fontSize="13px"
                color={sub}
                whiteSpace="nowrap"
              >
                Balancing Mode
              </Text>
              <Text
                fontSize="13px"
                color={text}
                fontWeight="600"
                whiteSpace="nowrap"
              >
                Passive
              </Text>
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              gap={4}
            >
              <Text
                fontSize="13px"
                color={sub}
                whiteSpace="nowrap"
              >
                Balance Progress
              </Text>
              <Text
                fontSize="13px"
                color={text}
                fontWeight="600"
                whiteSpace="nowrap"
              >
                78 %
              </Text>
            </Flex>

            <Progress
              value={78}
              size="md"
              borderRadius="full"
              colorScheme="green"
              bg={useColorModeValue("#E5E7EB", "#334155")}
              mt={2}
            />
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default CellBalancingStatus;