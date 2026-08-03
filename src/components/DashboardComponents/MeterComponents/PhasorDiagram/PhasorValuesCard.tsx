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

const voltageRows = [
  {
    parameter: "RMS Magnitude",
    r: "240.5",
    y: "239.8",
    b: "240.2",
    rn: "0.4",
    yn: "0.5",
    bn: "0.3",
    unit: "V",
  },
  {
    parameter: "Phase Angle",
    r: "0.0",
    y: "-120.1",
    b: "119.8",
    rn: "",
    yn: "",
    bn: "",
    unit: "°",
  },
  {
    parameter: "Frequency",
    r: "",
    y: "50.01",
    b: "",
    unit: "Hz",
  },
  {
    parameter: "Voltage Unbalance",
    r: "",
    y: "1.02",
    b: "",
    unit: "%",
  },
];

const currentRows = [
  {
    parameter: "RMS Magnitude",
    r: "2162",
    y: "2149",
    b: "2172",
    rn: "15",
    yn: "18",
    bn: "16",
    unit: "A",
  },
  {
    parameter: "Phase Angle",
    r: "-28.6",
    y: "-148.9",
    b: "91.2",
    rn: "",
    yn: "",
    bn: "",
    unit: "°",
  },
  {
    parameter: "Current Unbalance",
    r: "",
    y: "0.86",
    b: "",
    unit: "%",
  },
  {
    parameter: "Neutral Current",
    r: "",
    y: "28.4",
    b: "",
    unit: "A",
  },
  {
    parameter: "Power Factor (Total)",
    r: "",
    y: "0.96 (Leading)",
    b: "",
    unit: "—",
  },
];

const PhasorValuesCard = () => {
  const bg = useColorModeValue("#ffffff", "#071d36");

  const borderColor = useColorModeValue(
    "#E2E8F0",
    "#16365f"
  );

  const textColor = useColorModeValue(
    "#1A202C",
    "#D7E4FF"
  );

  const headerColor = useColorModeValue(
    "#4A5568",
    "#9FB4D1"
  );

  const sectionColor = "#3B82F6";

  return (
    <Box
      bg={bg}
      borderRadius="8px"
      border={`1px solid ${borderColor}`}
      p="8px"
      h="100%"
      overflow="hidden"
    >
      <Text fontSize="12px" fontWeight="700" color={textColor} mb="2">
        PHASOR VALUES
      </Text>

        <Table variant="unstyled" size="xs" style={{ borderCollapse: "collapse", width: "100%", tableLayout: 'fixed' }}>
        <Thead>
          <Tr>
            <Th
              color={headerColor}
              py="8px"
              px="6px"
              fontSize="10px"
              textAlign="left"
              style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
            >
              Parameter
            </Th>
            <Th
              color={headerColor}
              py="8px"
              px="6px"
              fontSize="10px"
              textAlign="center"
              style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}`, minWidth: 60 }}
            >
              R (A)
            </Th>
            <Th
              color={headerColor}
              py="8px"
              px="6px"
              fontSize="10px"
              textAlign="center"
              style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}`, minWidth: 60 }}
            >
              Y (B)
            </Th>
            <Th
              color={headerColor}
              py="8px"
              px="6px"
              fontSize="10px"
              textAlign="center"
              style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}`, minWidth: 60 }}
            >
              B (C)
            </Th>
            <Th
              color={headerColor}
              py="8px"
              px="6px"
              fontSize="10px"
              textAlign="center"
              style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}`, minWidth: 54 }}
            >
              R (N)
            </Th>
            <Th
              color={headerColor}
              py="8px"
              px="6px"
              fontSize="10px"
              textAlign="center"
              style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}`, minWidth: 54 }}
            >
              Y (N)
            </Th>
            <Th
              color={headerColor}
              py="8px"
              px="6px"
              fontSize="10px"
              textAlign="center"
              style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}`, minWidth: 54 }}
            >
              B (N)
            </Th>
            <Th
              color={headerColor}
              py="8px"
              px="6px"
              fontSize="10px"
              textAlign="center"
              style={{ borderBottom: `1px solid ${borderColor}`, minWidth: 48 }}
            >
              Unit
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          <Tr>
            <Td
              colSpan={8}
              py="6px"
              px="4px"
              fontSize="10px"
              fontWeight="700"
              color={sectionColor}
              style={{ borderBottom: `1px solid ${borderColor}` }}
            >
              VOLTAGE PHASORS
            </Td>
          </Tr>

          {voltageRows.map((row, idx) => (
            <Tr key={`v-${idx}`}>
              <Td
                  color={textColor}
                  py="6px"
                  px="6px"
                  fontSize="10px"
                  style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
                >
                {row.parameter}
              </Td>
                <Td
                  color={textColor}
                  py="6px"
                  px="6px"
                  fontSize="10px"
                  textAlign="center"
                  style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
                >
                  {row.r}
                </Td>
                <Td
                  color={textColor}
                  py="6px"
                  px="6px"
                  fontSize="10px"
                  textAlign="center"
                  style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
                >
                  {row.y}
                </Td>
                <Td
                  color={textColor}
                  py="6px"
                  px="6px"
                  fontSize="10px"
                  textAlign="center"
                  style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
                >
                  {row.b}
                </Td>
                <Td
                  color={textColor}
                  py="6px"
                  px="6px"
                  fontSize="10px"
                  textAlign="center"
                  style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
                >
                  {row.rn}
                </Td>
                <Td
                  color={textColor}
                  py="6px"
                  px="6px"
                  fontSize="10px"
                  textAlign="center"
                  style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
                >
                  {row.yn}
                </Td>
                <Td
                  color={textColor}
                  py="6px"
                  px="6px"
                  fontSize="10px"
                  textAlign="center"
                  style={{ borderBottom: `1px solid ${borderColor}` }}
                >
                  {row.bn}
                </Td>
                <Td
                  color={textColor}
                  py="6px"
                  px="6px"
                  fontSize="10px"
                  textAlign="center"
                  style={{ borderBottom: `1px solid ${borderColor}` }}
                >
                  {row.unit}
                </Td>
            </Tr>
          ))}

          <Tr>
            <Td
              colSpan={8}
              py="6px"
              px="4px"
              fontSize="10px"
              fontWeight="700"
              color={sectionColor}
              style={{ borderBottom: `1px solid ${borderColor}` }}
            >
              CURRENT PHASORS
            </Td>
          </Tr>

          {currentRows.map((row, idx) => (
            <Tr key={`c-${idx}`}>
              <Td
                color={textColor}
                py="6px"
                px="6px"
                fontSize="10px"
                style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
              >
                {row.parameter}
              </Td>
              <Td
                color={textColor}
                py="6px"
                px="6px"
                fontSize="10px"
                textAlign="center"
                style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
              >
                {row.r}
              </Td>
              <Td
                color={textColor}
                py="6px"
                px="6px"
                fontSize="10px"
                textAlign="center"
                style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
              >
                {row.y}
              </Td>
              <Td
                color={textColor}
                py="6px"
                px="6px"
                fontSize="10px"
                textAlign="center"
                style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
              >
                {row.b}
              </Td>
              <Td
                color={textColor}
                py="6px"
                px="6px"
                fontSize="10px"
                textAlign="center"
                style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
              >
                {row.rn}
              </Td>
              <Td
                color={textColor}
                py="6px"
                px="6px"
                fontSize="10px"
                textAlign="center"
                style={{ borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}
              >
                {row.yn}
              </Td>
              <Td
                color={textColor}
                py="6px"
                px="6px"
                fontSize="10px"
                textAlign="center"
                style={{ borderBottom: `1px solid ${borderColor}` }}
              >
                {row.bn}
              </Td>
              <Td
                color={textColor}
                py="6px"
                px="6px"
                fontSize="10px"
                textAlign="center"
                style={{ borderBottom: `1px solid ${borderColor}` }}
              >
                {row.unit}
              </Td>
            </Tr>
          ))}
        </Tbody>
        </Table>
    </Box>
  );
};

export default PhasorValuesCard;