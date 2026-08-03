import React from "react";
import {
  Badge,
  Box,
  Flex,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

const events = [
  {
    time: "10:24:31",
    event: "Cell Over Voltage",
    severity: "Major",
  },
  {
    time: "10:18:05",
    event: "Cell Imbalance",
    severity: "Minor",
  },
  {
    time: "09:56:18",
    event: "Rack Communication Restored",
    severity: "Info",
  },
  {
    time: "09:32:47",
    event: "Smoke Sensor Warning",
    severity: "Major",
  },
  {
    time: "08:44:20",
    event: "HVIL Closed",
    severity: "Info",
  },
];

const badgeColor = (severity: string) => {
  switch (severity) {
    case "Major":
      return "orange";
    case "Minor":
      return "yellow";
    default:
      return "blue";
  }
};

export default function RecentEvents() {
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
      h="300px"
      overflow="hidden"
    >
      <Flex
        h="42px"
        px={4}
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor={border}
      >
        <Text
          fontSize="14px"
          fontWeight="700"
          color={title}
        >
          Recent Events
        </Text>

        <HStack spacing={2}>
          <Select
            size="xs"
            w="85px"
          >
            <option>Today</option>
            <option>Week</option>
          </Select>
        </HStack>
      </Flex>

      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Time</Th>
              <Th>Event</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>

          <Tbody>
                        {events.map((item, index) => (
              <Tr key={index}>
                <Td
                  fontSize="11px"
                  color={text}
                  whiteSpace="nowrap"
                >
                  {item.time}
                </Td>

                <Td
                  fontSize="11px"
                  color={text}
                  maxW="180px"
                >
                  {item.event}
                </Td>

                <Td>
                  <Badge
                    colorScheme={badgeColor(item.severity)}
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="9px"
                    textTransform="none"
                  >
                    {item.severity}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex
        h="30px"
        px={4}
        align="center"
        justify="flex-end"
        borderTop="1px solid"
        borderColor={border}
      >
        <Text
          fontSize="11px"
          fontWeight="600"
          color="blue.500"
          cursor="pointer"
          _hover={{
            textDecoration: "underline",
          }}
        >
          View All →
        </Text>
      </Flex>
    </Box>
  );
}
    