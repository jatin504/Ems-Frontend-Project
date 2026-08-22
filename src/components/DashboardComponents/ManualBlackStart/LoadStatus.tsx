import {
  Badge,
  Box,
  Divider,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const loads = [
  {
    name: "BESS Aux Panel",
    type: "Electrical",
    priority: 1,
    status: "ONLINE",
    power: "18.50",
  },
  {
    name: "Control & Communication",
    type: "Electrical",
    priority: 1,
    status: "ONLINE",
    power: "8.40",
  },
  {
    name: "Fire Protection System",
    type: "Electrical",
    priority: 1,
    status: "ONLINE",
    power: "6.20",
  },
  {
    name: "HVAC System",
    type: "Mechanical",
    priority: 2,
    status: "ONLINE",
    power: "7.50",
  },
  {
    name: "Lighting System",
    type: "Electrical",
    priority: 2,
    status: "ONLINE",
    power: "1.50",
  },
];

const LoadStatus = () => {
  const bg = useColorModeValue("white", "#0F172A");
  const border = useColorModeValue("#E5E7EB", "#1E293B");
  const text = useColorModeValue("#374151", "#CBD5E1");
  const muted = useColorModeValue("#6B7280", "#94A3B8");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      overflow="hidden"
      h="100%"
      maxH="330px"
      display="flex"
      flexDirection="column"
    >
      <VStack spacing={0} align="stretch" h="100%">
        <HStack px={3} h="40px">
          <Text fontSize="14px" fontWeight="700">
            Load Status (During Black Start)
          </Text>
        </HStack>

        <Divider />

        <Table
          size="sm"
          variant="unstyled"
          sx={{
            tableLayout: "fixed",
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <Thead>
            <Tr h="28px">
              <Th pl={3} w="170px" textTransform="none" fontSize="10px" color={muted}>
                Load Name
              </Th>

              <Th w="95px" textTransform="none" fontSize="10px" color={muted}>
                Type
              </Th>

              <Th w="70px" textTransform="none" fontSize="10px" color={muted}>
                Priority
              </Th>

              <Th w="90px" textTransform="none" fontSize="10px" color={muted}>
                Status
              </Th>

              <Th pr={3} textAlign="right" textTransform="none" fontSize="10px" color={muted}>
                Power (kW)
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {loads.map((item, index) => (
              <Tr
                key={index}
                h="32px"
                borderTop="1px solid"
                borderColor={border}
                _hover={{
                  bg: useColorModeValue("#F8FAFC", "#162033"),
                }}
              >
                <Td pl={3} fontSize="11px" fontWeight="500" color={text} whiteSpace="nowrap">
                  {item.name}
                </Td>

                <Td fontSize="11px" color={text}>
                  {item.type}
                </Td>

                <Td fontSize="11px" textAlign="center" color={text}>
                  {item.priority}
                </Td>

                <Td>
                  <Badge variant="unstyled" color="#22C55E" fontSize="10px" fontWeight="700">
                    {item.status}
                  </Badge>
                </Td>

                <Td pr={3} textAlign="right" fontSize="11px" fontWeight="600" color={text}>
                  {item.power}
                </Td>
              </Tr>
            ))}

            <Tr borderTop="1px solid" borderColor={border}>
              <Td colSpan={4} py={2} textAlign="right" fontSize="12px" fontWeight="700" color={text}>
                Total Load
              </Td>

              <Td pr={3} py={2} textAlign="right" fontSize="12px" fontWeight="700" color={text}>
                42.10 kW
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};

export default LoadStatus;