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

interface AlertRow {
  time: string;
  device: string;
  code: string | number;
  message: string;
  severity: string;
  corrective: string;
  normTime: string;
  ackTime: string;
  comment: string;
}

export default function PCSAlertsTable({ data = [] }: { data?: AlertRow[] }) {
  const containerBg = useColorModeValue("white", "gray.800");
  const headerTextColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const thTextColor = useColorModeValue("gray.700", "gray.100");

  const rowBorderColor = useColorModeValue("red.600", "red.700");
  const rowHoverBg = useColorModeValue("red.600", "red.400");
  const severityTextColor = useColorModeValue("black", "gray.900");

  const colDividerColor = useColorModeValue(
    "rgba(0,0,0,0.06)",
    "rgba(255,255,255,0.18)"
  );

  return (
    <Box
      bg={containerBg}
      p={2}
      rounded="md"
      shadow="sm"
      fontSize="10px"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Top header (title only) */}
      <HStack mb={2} align="center">
        <Text fontWeight="600" color={headerTextColor} fontSize="18px">
          PCS Alerts
        </Text>
      </HStack>

      {/* Card body with SINGLE scroll */}
      <Box
        border="1px solid"
        borderColor={borderColor}
        rounded="sm"
        flex="1"
        overflow="auto"           // 👈 ek hi scroll (X + Y)
      >
        <Table
          variant="simple"
          size="sm"
          width="100%"
          sx={{
            tableLayout: "fixed",
            minWidth: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          {/* Header + body same table = same scroll */}
          <Thead bg={headerBg}>
            <Tr>
              <Th
                w="40px"
                py={1}
                px={1}
                fontSize="10px"
                color={thTextColor}
                borderRight="1px solid"
                borderColor={colDividerColor}
              >
                {" "}
              </Th>
              <Th
                w="150px"
                py={1}
                px={2}
                fontSize="10px"
                color={thTextColor}
                borderRight="1px solid"
                borderColor={colDividerColor}
              >
                Activation Time
              </Th>
              <Th
                w="80px"
                py={1}
                px={2}
                fontSize="10px"
                color={thTextColor}
                borderRight="1px solid"
                borderColor={colDividerColor}
              >
                Device
              </Th>
              <Th
                w="70px"
                py={1}
                px={2}
                fontSize="10px"
                color={thTextColor}
                borderRight="1px solid"
                borderColor={colDividerColor}
              >
                Code
              </Th>
              <Th
                w="260px"
                py={1}
                px={2}
                fontSize="10px"
                color={thTextColor}
                borderRight="1px solid"
                borderColor={colDividerColor}
              >
                Message
              </Th>
              <Th
                w="80px"
                py={1}
                px={2}
                fontSize="10px"
                color={thTextColor}
                borderRight="1px solid"
                borderColor={colDividerColor}
              >
                Severity
              </Th>
              <Th
                w="260px"
                py={1}
                px={2}
                fontSize="10px"
                color={thTextColor}
                borderRight="1px solid"
                borderColor={colDividerColor}
              >
                Corrective Measures
              </Th>
              <Th
                w="80px"
                py={1}
                px={2}
                fontSize="10px"
                color={thTextColor}
                borderRight="1px solid"
                borderColor={colDividerColor}
              >
                Norm Time
              </Th>
              <Th
                w="80px"
                py={1}
                px={2}
                fontSize="10px"
                color={thTextColor}
                borderRight="1px solid"
                borderColor={colDividerColor}
              >
                Ack Time
              </Th>
              <Th
                w="60px"
                py={1}
                px={2}
                fontSize="10px"
                color={thTextColor}
              >
                Comment
              </Th>
            </Tr>
          </Thead>

          <Tbody bg="red.500" color="white">
            {data.map((r, idx) => (
              <Tr
                key={idx}
                borderBottom="1px solid"
                borderColor={rowBorderColor}
                _hover={{ bg: rowHoverBg }}
              >
                {/* Icon */}
                <Td
                  w="40px"
                  py={1}
                  px={1}
                  borderRight="1px solid"
                  borderColor={colDividerColor}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={AiOutlineWarning} boxSize={3} />
                  </Box>
                </Td>

                {/* Activation Time */}
                <Td
                  w="150px"
                  py={1}
                  px={2}
                  fontSize="10px"
                  whiteSpace="nowrap"
                  borderRight="1px solid"
                  borderColor={colDividerColor}
                >
                  {r.time}
                </Td>

                {/* Device */}
                <Td
                  w="80px"
                  py={1}
                  px={2}
                  fontSize="10px"
                  whiteSpace="nowrap"
                  borderRight="1px solid"
                  borderColor={colDividerColor}
                >
                  {r.device}
                </Td>

                {/* Code */}
                <Td
                  w="70px"
                  py={1}
                  px={2}
                  fontSize="10px"
                  whiteSpace="nowrap"
                  borderRight="1px solid"
                  borderColor={colDividerColor}
                >
                  {r.code}
                </Td>

                {/* Message */}
                <Td
                  w="260px"
                  py={1}
                  px={2}
                  fontSize="10px"
                  borderRight="1px solid"
                  borderColor={colDividerColor}
                  verticalAlign="top"
                >
                  <Box
                    as="span"
                    display="block"
                    w="100%"
                    whiteSpace="normal"
                    lineHeight="1.2"
                    wordBreak="break-word"
                  >
                    {r.message}
                  </Box>
                </Td>

                {/* Severity */}
                <Td
                  w="80px"
                  py={1}
                  px={2}
                  fontSize="10px"
                  whiteSpace="nowrap"
                  borderRight="1px solid"
                  borderColor={colDividerColor}
                  verticalAlign="top"
                >
                  <Badge
                    colorScheme="yellow"
                    variant="subtle"
                    color={severityTextColor}
                    px={2}
                    py={0.5}
                    fontSize="9px"
                  >
                    {r.severity}
                  </Badge>
                </Td>

                {/* Corrective Measures */}
                <Td
                  w="260px"
                  py={1}
                  px={2}
                  fontSize="10px"
                  borderRight="1px solid"
                  borderColor={colDividerColor}
                  verticalAlign="top"
                >
                  <Box
                    as="span"
                    display="block"
                    w="100%"
                    whiteSpace="normal"
                    lineHeight="1.2"
                    wordBreak="break-word"
                  >
                    {r.corrective}
                  </Box>
                </Td>

                {/* Norm Time */}
                <Td
                  w="80px"
                  py={1}
                  px={2}
                  fontSize="10px"
                  whiteSpace="nowrap"
                  borderRight="1px solid"
                  borderColor={colDividerColor}
                >
                  {r.normTime}
                </Td>

                {/* Ack Time */}
                <Td
                  w="80px"
                  py={1}
                  px={2}
                  fontSize="10px"
                  whiteSpace="nowrap"
                  borderRight="1px solid"
                  borderColor={colDividerColor}
                >
                  {r.ackTime}
                </Td>

                {/* Comment */}
                <Td
                  w="60px"
                  py={1}
                  px={2}
                  fontSize="10px"
                  whiteSpace="nowrap"
                >
                  {r.comment}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}