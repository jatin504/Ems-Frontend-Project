import {
  Box,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

const BillingPreview = () => {
  const bg = useColorModeValue("white", "#161B1B");
  const headerBg = useColorModeValue("#F4F6F8", "#1D2328");
  const titleColor = useColorModeValue("#2D3748", "gray.100");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      p="0"
      bg={bg}
      borderRadius="10px"
      overflow="hidden"
      boxShadow="sm"
    >
      {/* Header */}
      <HStack
        justify="space-between"
        px="12px"
        py="8px"
        bg={headerBg}
      >
        <Text fontSize="13px" fontWeight="600" color={titleColor}>
          Billing Preview
        </Text>

        {/* small icons */}
        <HStack spacing="4px">
          <Box w="4px" h="4px" bg={borderColor} borderRadius="full" />
          <Box w="4px" h="4px" bg={borderColor} borderRadius="full" />
        </HStack>
      </HStack>

      {/* Table */}
      <Box px="12px" py="10px">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th fontSize="11px" color={subtitleColor}>Date</Th>
              <Th fontSize="11px" color={subtitleColor}>Time Block</Th>
              <Th fontSize="11px" color={subtitleColor}>Irradiance (kWh/m²)</Th>
              <Th fontSize="11px" color={subtitleColor} textAlign="right">
                DG (kWh)
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td fontSize="13px" fontWeight="500" color={titleColor}>12 Jul</Td>
              <Td fontSize="13px" color={subtitleColor}>10.00–14.00</Td>
              <Td fontSize="13px" color={subtitleColor}>0.65</Td>
              <Td fontSize="13px" fontWeight="600" textAlign="right">
                55,770 kWh
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default BillingPreview;