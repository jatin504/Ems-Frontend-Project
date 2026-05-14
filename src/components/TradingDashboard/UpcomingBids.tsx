import {
  Box,
  Text,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";

const UpcomingBids = () => {
  const bg = useColorModeValue("#ffffff", "#0f2235");
  const border = useColorModeValue("#e2e8f0", "#1f3b5b");
  const headerColor = useColorModeValue("gray.600", "gray.400");
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="lg"
      p={3}
      boxShadow="0 8px 20px rgba(0,0,0,0.25)" //  highlight
      transition="0.2s"
      _hover={{
        boxShadow: "0 12px 28px rgba(0,0,0,0.35)", //  hover lift
        transform: "translateY(-2px)",
      }}
    >
      {/* 🔝 HEADER */}
      <HStack justify="space-between" mb={3}>
        <HStack spacing={4}>
          <Text fontSize="sm" fontWeight="600">
            Upcoming Bids
          </Text>

          <Text fontSize="xs" color="gray.500">
            STRATEGY
          </Text>
          <Text fontSize="xs" color="gray.500">
            ANCILLARY
          </Text>
          <Text fontSize="xs" color="gray.500">
            HYBRID
          </Text>
        </HStack>
      </HStack>

      {/* 🔻 TABLE */}
      <Table size="sm">
        <Thead>
          <Tr>
            <Th fontSize="xs" color={headerColor}>
              Time
            </Th>
            <Th fontSize="xs" color={headerColor}>
              Operation
            </Th>
            <Th fontSize="xs" color={headerColor}>
              Volume (MW)
            </Th>
            <Th fontSize="xs" color={headerColor}>
              Bid Price (₹/MWh)
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          <Tr _hover={{ bg: useColorModeValue("#edf2f7", "#163152") }}>
            <Td fontSize="sm" color={textColor}>
              14:30
            </Td>
            <Td fontSize="sm" color={textColor}>
              Discharge
            </Td>
            <Td fontSize="sm" color={textColor}>
              20 MW
            </Td>
            <Td fontSize="sm" fontWeight="600" color="#f59e0b">
              ₹6,100
            </Td>
          </Tr>

          <Tr _hover={{ bg: useColorModeValue("#edf2f7", "#163152") }}>
            <Td fontSize="sm" color={textColor}>
              15:00
            </Td>
            <Td fontSize="sm" color={textColor}>
              Charge
            </Td>
            <Td fontSize="sm" color={textColor}>
              15 MW
            </Td>
            <Td fontSize="sm" fontWeight="600" color="#facc15">
              ₹3,800
            </Td>
          </Tr>

          <Tr _hover={{ bg: useColorModeValue("#edf2f7", "#163152") }}>
            <Td fontSize="sm" color={textColor}>
              16:00
            </Td>
            <Td fontSize="sm" color={textColor}>
              Discharge
            </Td>
            <Td fontSize="sm" color={textColor}>
              25 MW
            </Td>
            <Td fontSize="sm" fontWeight="600" color="#f59e0b">
              ₹7,200
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default UpcomingBids;