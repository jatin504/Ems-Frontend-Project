import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const otherParametersData = [
  {
    parameter: "System Type",
    value: "3P 4W",
    unit: "—",
    description: "Three Phase Four Wire",
  },
  {
    parameter: "Wiring Type",
    value: "Delta",
    unit: "—",
    description: "Voltage Reference",
  },
  {
    parameter: "CT Ratio",
    value: "3000/5",
    unit: "A",
    description: "Current Transformer Ratio",
  },
  {
    parameter: "PT Ratio",
    value: "720/415",
    unit: "V",
    description: "Potential Transformer Ratio",
  },
  {
    parameter: "CT Secondary Current",
    value: "5",
    unit: "A",
    description: "Nominal CT Secondary",
  },
  {
    parameter: "PT Secondary Voltage",
    value: "415",
    unit: "V",
    description: "Nominal PT Secondary",
  },
  {
    parameter: "Inverter Mode",
    value: "Grid Following",
    unit: "—",
    description: "Inverter Operation Mode",
  },
  {
    parameter: "Meter Firmware",
    value: "v2.14.3",
    unit: "—",
    description: "Meter Firmware Version",
  },
  {
    parameter: "Last Calibration",
    value: "12 May 2022",
    unit: "—",
    description: "Meter Last Calibration Date",
  },
];

const OtherParametersCard = () => {
  const bg = useColorModeValue("#ffffff", "#071d36");

  const borderColor = useColorModeValue(
    "rgba(0,0,0,0.08)",
    "rgba(255,255,255,0.08)"
  );

  const textColor = useColorModeValue(
    "#1A202C",
    "#D7E4FF"
  );

  const headerColor = useColorModeValue(
    "#4A5568",
    "#B8C7E0"
  );

  return (
    <Box
      bg={bg}
      borderRadius="8px"
      overflow="hidden"
      border={`1px solid ${borderColor}`}
      h="100%"
    >
      <Box
        px="14px"
        py="10px"
        borderBottom={`1px solid ${borderColor}`}
      >
        <Text
          fontSize="13px"
          fontWeight="700"
          color={textColor}
          letterSpacing="0.3px"
        >
          OTHER PARAMETERS
        </Text>
      </Box>

      <Table
        variant="unstyled"
        size="sm"
      >
        <Thead>
          <Tr>
            <Th
              color={headerColor}
              fontSize="11px"
              textTransform="none"
            >
              Parameter
            </Th>

            <Th
              color={headerColor}
              fontSize="11px"
              textTransform="none"
              textAlign="center"
            >
              Value
            </Th>

            <Th
              color={headerColor}
              fontSize="11px"
              textTransform="none"
              textAlign="center"
            >
              Unit
            </Th>

            <Th
              color={headerColor}
              fontSize="11px"
              textTransform="none"
            >
              Description
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {otherParametersData.map((row) => (
            <Tr key={row.parameter}>
              <Td
                color={textColor}
                fontSize="11px"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.parameter}
              </Td>

              <Td
                color={textColor}
                fontSize="11px"
                textAlign="center"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.value}
              </Td>

              <Td
                color={textColor}
                fontSize="11px"
                textAlign="center"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.unit}
              </Td>

              <Td
                color={textColor}
                fontSize="11px"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.description}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OtherParametersCard;