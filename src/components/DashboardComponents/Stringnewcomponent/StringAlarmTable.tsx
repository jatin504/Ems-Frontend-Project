import React from "react";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

import { useAlarmLatest } from "../../../hooks/useAlarmLatest";

type Props = {
  selectedInverter: string;
};

const StringAlarmTable = ({
  selectedInverter = "",
}: Props) => {
  const bg = useColorModeValue(
    "#FFFFFF",
    "#081C36"
  );

  const borderColor = useColorModeValue(
    "#DCE5F0",
    "#12345B"
  );

  const headerText = useColorModeValue(
    "#6B7280",
    "#8FA8C3"
  );

  const titleColor = useColorModeValue(
    "#111827",
    "#EAF4FF"
  );

  const rowBorder = useColorModeValue(
    "#E5EDF5",
    "#102B4C"
  );

  const tableText = useColorModeValue(
    "#1F2937",
    "#DCEBFF"
  );

  const viewAllColor = useColorModeValue(
    "#1976D2",
    "#78B7FF"
  );

  const highBg = useColorModeValue(
    "#E4572E",
    "#C64B26"
  );

  const mediumBg = useColorModeValue(
    "#D38A18",
    "#C77C11"
  );

  const badgeText = "#FFFFFF";

  const { pageRows } = useAlarmLatest();

  const { isOpen, onOpen, onClose } = useDisclosure();

  /* ================= FILTER SELECTED INVERTER ================= */

  const filteredRows = pageRows.filter((item) => {
  const inverterValue =
  typeof selectedInverter === "string"
    ? selectedInverter
    : selectedInverter?.label ||
      selectedInverter?.value ||
      "";

const selectedNumber =
  inverterValue.match(/\d+/)?.[0];

  if (!selectedNumber) return false;

  return (
    item.device.toLowerCase() ===
    `inverter_${selectedNumber}`.toLowerCase()
  );
});

  return (
    <Box w="100%" bg={bg} border={`1px solid ${borderColor}`} borderRadius="14px" px={4} py={3} overflowX="auto">
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontSize="13px" fontWeight="700" letterSpacing="0.5px" color={titleColor}>
          String Alarms
        </Text>

        {/* <Button variant="link" fontSize="12px" fontWeight="500" onClick={onOpen} color={viewAllColor}>
          View All
        </Button> */}
      </Flex>

      {/* TABLE */}
      <Box maxH="260px" overflowY="auto">
        <Table variant="unstyled" size="sm">
          <Thead>
            <Tr borderBottom={`1px solid ${rowBorder}`}>
              <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText} fontSize="11px" fontWeight="500" textTransform="none" px={2}>Time</Th>
              <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText} fontSize="11px" fontWeight="500" textTransform="none" px={2}>Inverter</Th>
              <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText} fontSize="11px" fontWeight="500" textTransform="none" px={2}>String ID</Th>
              <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText} fontSize="11px" fontWeight="500" textTransform="none" px={2}>Alarm</Th>
              <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText} fontSize="11px" fontWeight="500" textTransform="none" px={2}>Current (A)</Th>
              <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText} fontSize="11px" fontWeight="500" textTransform="none" px={2}>Severity</Th>
              <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText} fontSize="11px" fontWeight="500" textTransform="none" px={2}>Status</Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredRows.map((item, index) => (
              <Tr key={index} borderBottom={`1px solid ${rowBorder}`}>
                <Td color={tableText} fontSize="11px" px={2} py={3} whiteSpace="nowrap">{item.time}</Td>
                <Td color={tableText} fontSize="11px" px={2} py={3}>{item.device}</Td>
                <Td color={tableText} fontSize="11px" px={2} py={3}>-----</Td>
                <Td color={tableText} fontSize="11px" px={2} py={3}>-----</Td>
                <Td color={tableText} fontSize="11px" px={2} py={3}>{item.value}</Td>
                <Td px={2} py={3}><Badge bg={item.severity?.toLowerCase() === "critical" ? highBg : mediumBg} color={badgeText} borderRadius="4px" px={3} py={1} fontSize="10px" fontWeight="600" textTransform="none" minW="62px" textAlign="center">{item.severity}</Badge></Td>
                <Td color={tableText} fontSize="11px" px={2} py={3}>{item.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Fullscreen modal for View All */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>STRING ALARMS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" overflowX="auto">
              <Box maxH="70vh" overflowY="auto">
                <Table variant="unstyled" size="sm">
                  <Thead>
                    <Tr borderBottom={`1px solid ${rowBorder}`}>
                      <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText}>Time</Th>
                      <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText}>Inverter</Th>
                      <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText}>String ID</Th>
                      <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText}>Alarm</Th>
                      <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText}>Current (A)</Th>
                      <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText}>Severity</Th>
                      <Th position="sticky" top={0} bg={bg} zIndex={2} color={headerText}>Status</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {filteredRows.map((item, index) => (
                      <Tr key={index} borderBottom={`1px solid ${rowBorder}`}>
                        <Td color={tableText} fontSize="11px" px={2} py={3} whiteSpace="nowrap">{item.time}</Td>
                        <Td color={tableText} fontSize="11px" px={2} py={3}>{item.device}</Td>
                        <Td color={tableText} fontSize="11px" px={2} py={3}>-----</Td>
                        <Td color={tableText} fontSize="11px" px={2} py={3}>-----</Td>
                        <Td color={tableText} fontSize="11px" px={2} py={3}>{item.value}</Td>
                        <Td px={2} py={3}><Badge bg={item.severity?.toLowerCase() === "critical" ? highBg : mediumBg} color={badgeText} borderRadius="4px" px={3} py={1} fontSize="10px" fontWeight="600" textTransform="none" minW="62px" textAlign="center">{item.severity}</Badge></Td>
                        <Td color={tableText} fontSize="11px" px={2} py={3}>{item.status}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StringAlarmTable;