import {
  Badge,
  Box,
  Divider,
  HStack,
  IconButton,
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
import { ChevronRightIcon } from "@chakra-ui/icons";

const eventLogs = [
  {
    time: "16:57:12",
    severity: "INFO",
    event: "Manual Black Start Initiated",
    details: "Operator selected Manual mode",
    user: "Operator-1",
  },
  {
    time: "16:57:18",
    severity: "INFO",
    event: "System Check Completed",
    details: "All prerequisites OK",
    user: "Operator-1",
  },
  {
    time: "16:59:24",
    severity: "INFO",
    event: "Master PCS Started",
    details: "PCS-01 started in GFM mode",
    user: "Operator-1",
  },
  {
    time: "17:02:15",
    severity: "INFO",
    event: "Master PCS Running",
    details: "Frequency: 50.01 Hz, Voltage: 33.01 kV",
    user: "System",
  },
  {
    time: "17:03:11",
    severity: "INFO",
    event: "Black Start Bus Energized",
    details: "Bus breaker closed successfully",
    user: "Operator-1",
  },
  {
    time: "17:03:45",
    severity: "INFO",
    event: "Step 3 In Progress",
    details: "Proceeding to Energize Aux Loads",
    user: "Operator-1",
  },
];

const BlackStartEventLog = () => {
  const bg = useColorModeValue("white", "#0F172A");
  const border = useColorModeValue("#E5E7EB", "#1E293B");

  const headerColor = useColorModeValue("#111827", "#F8FAFC");
  const textColor = useColorModeValue("#374151", "#CBD5E1");
  const muted = useColorModeValue("#6B7280", "#94A3B8");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      h="100%"
      maxH="330px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <VStack spacing={0} align="stretch" h="100%">
        <HStack justify="space-between" px={3} h="40px">
          <Text fontSize="14px" fontWeight="700" color={headerColor}>
            Black Start Event Log
          </Text>

          <HStack spacing={1}>
            <Text fontSize="11px" fontWeight="600" color="#2563EB" cursor="pointer">
              View All
            </Text>

            <IconButton
              aria-label="view"
              icon={<ChevronRightIcon />}
              variant="ghost"
              size="xs"
            />
          </HStack>
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
              <Th
                pl={3}
                fontSize="10px"
                color={muted}
                fontWeight="700"
                textTransform="none"
              >
                Time
              </Th>

              <Th fontSize="10px" color={muted} fontWeight="700" textTransform="none">
                Severity
              </Th>

              <Th fontSize="10px" color={muted} fontWeight="700" textTransform="none">
                Event
              </Th>

              <Th fontSize="10px" color={muted} fontWeight="700" textTransform="none">
                Details
              </Th>

              <Th pr={3} textAlign="right" fontSize="10px" color={muted} fontWeight="700" textTransform="none">
                User
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {eventLogs.map((item, index) => (
              <Tr
                key={index}
                h="34px"
                borderTop="1px solid"
                borderColor={border}
                _hover={{
                  bg: useColorModeValue("#F8FAFC", "#162033"),
                }}
              >
                <Td pl={3} fontSize="11px" color={textColor}>
                  {item.time}
                </Td>

                <Td>
                  <Badge
                    px={1.5}
                    py={0.5}
                    borderRadius="5px"
                    bg="#E0F2FE"
                    color="#2563EB"
                    fontSize="8px"
                    fontWeight="700"
                  >
                    {item.severity}
                  </Badge>
                </Td>

                <Td fontSize="11px" color={textColor} whiteSpace="nowrap">
                  {item.event}
                </Td>

                <Td fontSize="11px" color={textColor} whiteSpace="nowrap">
                  {item.details}
                </Td>

                <Td pr={3} textAlign="right" fontSize="11px" color={textColor}>
                  {item.user}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};

export default BlackStartEventLog;