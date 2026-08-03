import React, { useRef, useState, useEffect } from "react";
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
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

import { useAlarmLatest } from "../../../../hooks/useAlarmLatest";

const AlertsTable: React.FC = () => {
  const {
    pageRows,
    safeCurrentPage,
    totalPages,
    goToPrev,
    goToNext,
  } = useAlarmLatest();

  // LIGHT / DARK MODE
  const cardBg = useColorModeValue(
    "linear-gradient(180deg,#FFFFFF 0%, #F8FAFC 100%)",
    "linear-gradient(180deg,#0B2D4F 0%, #071C33 100%)"
  );

  const borderColor = useColorModeValue(
    "rgba(0,0,0,0.08)",
    "rgba(255,255,255,0.08)"
  );

  const headingColor = useColorModeValue(
    "#64748B",
    "#AFC2D6"
  );

  const rowTextColor = useColorModeValue(
    "#0F172A",
    "#FFFFFF"
  );

  const rowBorder = useColorModeValue(
    "rgba(0,0,0,0.06)",
    "rgba(255,255,255,0.05)"
  );

  const headerBorder = useColorModeValue(
    "rgba(0,0,0,0.08)",
    "rgba(255,255,255,0.08)"
  );

  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  return (
    <Box
      bg={cardBg}
      borderRadius="12px"
      border="1px solid"
      borderColor={borderColor}
      h="100%"
      ref={panelRef}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      px="14px"
      py="12px"
    >
      {/* HEADER */}
      <HStack
        justify="space-between"
        align="center"
        mb="16px"
      >
        <Text
          color={rowTextColor}
          fontSize="15px"
          fontWeight="700"
          letterSpacing="0.5px"
        >
          Inverter Alarms
        </Text>

        <Button
          size="sm"
          h="28px"
          minW="72px"
          bg="transparent"
          color={rowTextColor}
          border="1px solid"
          borderColor={borderColor}
          fontSize="11px"
          fontWeight="600"
          _hover={{
            bg: useColorModeValue(
              "rgba(0,0,0,0.04)",
              "rgba(255,255,255,0.08)"
            ),
          }}
          onClick={toggleFullscreen}
        >
          View All
        </Button>
      </HStack>

      {/* TABLE WRAPPER */}
      <Box flex="1" overflow="hidden">
        <Table
          variant="unstyled"
          width="100%"
          size="sm"
          sx={{
            tableLayout: "fixed",
            borderCollapse: "collapse",
          }}
        >
          {/* HEADER */}
          <Thead
            display="table"
            width="calc(100% - 6px)"
            tableLayout="fixed"
          >
            <Tr borderBottom={`1px solid ${headerBorder}`}>
              {/* TIME */}
              <Th
                w="28%"
                px="0"
                py="10px"
                textAlign="left"
                color={headingColor}
                fontSize="11px"
                fontWeight="600"
                letterSpacing="0.5px"
              >
                TIME
              </Th>

              {/* INVERTER ID */}
              <Th
                w="20%"
                px="0"
                py="10px"
                textAlign="left"
                color={headingColor}
                fontSize="11px"
                fontWeight="600"
                letterSpacing="0.5px"
              >
                INVERTER ID
              </Th>

              {/* ALARM */}
              <Th
                w="18%"
                px="0"
                py="10px"
                textAlign="left"
                color={headingColor}
                fontSize="11px"
                fontWeight="600"
                letterSpacing="0.5px"
              >
                ALARM
              </Th>

              {/* SEVERITY */}
              <Th
                w="17%"
                px="0"
                py="10px"
                textAlign="center"
                color={headingColor}
                fontSize="11px"
                fontWeight="600"
                letterSpacing="0.5px"
              >
                SEVERITY
              </Th>

              {/* STATUS */}
              <Th
                w="17%"
                px="0"
                py="10px"
                textAlign="center"
                color={headingColor}
                fontSize="11px"
                fontWeight="600"
                letterSpacing="0.5px"
              >
                STATUS
              </Th>
            </Tr>
          </Thead>

          {/* BODY */}
          <Tbody
            display="block"
            width="100%"
            maxHeight={isFullscreen ? "calc(100vh - 220px)" : "220px"}
            overflowY="auto"
            overflowX="hidden"
          >
            {pageRows.map((row, i) => (
              <Tr
                key={i}
                display="table"
                width="100%"
                tableLayout="fixed"
                borderBottom={`1px solid ${rowBorder}`}
              >
                {/* TIME */}
                <Td
                  w="28%"
                  px="0"
                  py="14px"
                  textAlign="left"
                  color={rowTextColor}
                  fontSize="12px"
                  fontWeight="500"
                  whiteSpace="nowrap"
                >
                  {row.time}
                </Td>

                {/* INVERTER ID */}
                <Td
                  w="20%"
                  px="0"
                  py="14px"
                  textAlign="left"
                  color={rowTextColor}
                  fontSize="12px"
                  fontWeight="500"
                  whiteSpace="nowrap"
                >
                  {row.device}
                </Td>

                {/* ALARM */}
                <Td
                  w="18%"
                  px="0"
                  py="14px"
                  textAlign="left"
                  color={rowTextColor}
                  fontSize="12px"
                  fontWeight="500"
                  whiteSpace="nowrap"
                >
                  {row.type}
                </Td>

                {/* SEVERITY */}
                <Td
                  w="17%"
                  px="0"
                  py="14px"
                  textAlign="center"
                >
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    minW="72px"
                    h="28px"
                    px="10px"
                    borderRadius="5px"
                    bg={
                      row.severity?.toLowerCase() === "critical" ||
                      row.severity?.toLowerCase() === "high"
                        ? "#D69E1F"
                        : row.severity?.toLowerCase() === "info"
                        ? "#B7791F"
                        : "#C58A1B"
                    }
                    color="white"
                    fontSize="11px"
                    fontWeight="600"
                    textTransform="lowercase"
                  >
                    {row.severity}
                  </Box>
                </Td>

                {/* STATUS */}
                <Td
                  w="17%"
                  px="0"
                  py="14px"
                  textAlign="center"
                >
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    minW="92px"
                    h="28px"
                    px="10px"
                    borderRadius="5px"
                    bg="#B4532A"
                    color="white"
                    fontSize="11px"
                    fontWeight="600"
                  >
                    {row.status}
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* FOOTER */}
      <HStack
        justify="flex-end"
        spacing="12px"
        pt="10px"
      >
        <Text
          color={rowTextColor}
          fontSize="11px"
          fontWeight="600"
        >
          {safeCurrentPage} / {totalPages}
        </Text>

        <Text
          cursor="pointer"
          color={rowTextColor}
          fontSize="11px"
          opacity={safeCurrentPage === 1 ? 0.4 : 1}
          onClick={goToPrev}
        >
          Prev
        </Text>

        <Text
          cursor="pointer"
          color={rowTextColor}
          fontSize="11px"
          opacity={safeCurrentPage === totalPages ? 0.4 : 1}
          onClick={goToNext}
        >
          Next
        </Text>
      </HStack>
    </Box>
  );
};

export default AlertsTable;