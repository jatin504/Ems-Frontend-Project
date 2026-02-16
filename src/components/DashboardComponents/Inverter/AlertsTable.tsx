import React from "react";
import {
  Box,
  HStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiOutlineBell, AiOutlineWarning } from "react-icons/ai";

import { useAlarmLatest } from "../../../hooks/useAlarmLatest";

const AlertsTable: React.FC = () => {
  const { pageRows } = useAlarmLatest();

  const containerBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const headerTextColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box bg={containerBg} p={2} rounded="md" shadow="sm" height="100%">
      {/* HEADER */}
      <HStack mb={2}>
        <Text fontSize="18px" fontWeight="600" color={headerTextColor}>
          Alerts
        </Text>
      </HStack>

      {/* TABLE */}
      <Box border="1px solid" borderColor={borderColor} overflow="auto">
        <Table size="sm">
          <Thead bg={headerBg}>
            <Tr>
              <Th />
              <Th>Activation Time</Th>
              <Th>Device</Th>
              <Th>State</Th>
              {/* <Th>Type</Th> */}
              <Th>Severity</Th>
              <Th>ACK Time</Th>     
              <Th>Status</Th>
              <Th>Comment</Th>
            </Tr>
          </Thead>

          <Tbody bg="red.500" color="white">
            {pageRows.map((row, i) => (
              <Tr key={i}>
                <Td>
                  <Icon as={AiOutlineWarning} />
                </Td>

                <Td>{row.time}</Td>
                <Td>{row.device}</Td>
                <Td>{row.type}</Td>
                {/* <Td>{row.type}</Td> */}

                <Td>
                  <Badge colorScheme="yellow" fontSize="9px">
                    {row.severity}
                  </Badge>
                </Td>

                <Td>{row.ackTime}</Td>   

                <Td>{row.status}</Td>
                <Td>{row.comment}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default AlertsTable;
