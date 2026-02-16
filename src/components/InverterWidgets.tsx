import React from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputRightAddon,
  Badge,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";

/* ------------------------------ atoms ------------------------------ */

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
  const bg = useColorModeValue("#0e2a47", "#102843");
  return (
    <Box bg={bg} color="white" px={3} py={2} rounded="md" fontWeight="semibold">
      {title}
    </Box>
  );
};

const LabelValue: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <Flex justify="space-between" fontSize="sm" py={0.5}>
    <Text color="gray.400">{label}</Text>
    <Text fontWeight="semibold">{value}</Text>
  </Flex>
);

const StatusDot: React.FC<{ status: "ok" | "warn" | "bad" }> = ({ status }) => {
  const color =
    status === "ok" ? "green.400" : status === "warn" ? "yellow.400" : "red.400";
  return (
    <Box
      as="span"
      w="14px"
      h="14px"
      rounded="full"
      bg={color}
      display="inline-block"
      border="2px solid"
      borderColor="whiteAlpha.700"
      shadow="sm"
    />
  );
};

/* ---------------------------- left-column cards ---------------------------- */

export const GlobalInfoCard: React.FC<{
  left: { [k: string]: React.ReactNode };
  right: { [k: string]: React.ReactNode };
  title?: string;
}> = ({ left, right, title = "Global Information" }) => {
  return (
    <Box
      rounded="lg"
      border="1px solid"
      borderColor="whiteAlpha.200"
      overflow="hidden"
      h="200px"              // <-- fill column height
    >
      <SectionHeader title={title} />
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3} p={2}>
        <Box>
          {Object.entries(left).map(([k, v]) => (
            <LabelValue key={k} label={`${k} :`} value={v} />
          ))}
        </Box>
        <Box>
          {Object.entries(right).map(([k, v]) => (
            <LabelValue key={k} label={`${k} :`} value={v} />
          ))}
        </Box>
      </Grid>
    </Box>
  );
};

export const MeanValuesCard: React.FC<{
  readDelayMs: number;
  writeDelayMs: number;
}> = ({ readDelayMs, writeDelayMs }) => {
  return (
    <Box
      rounded="lg"
      mt={"20px"}
      border="1px solid"
      borderColor="whiteAlpha.200"
      overflow="hidden"
      h="180px"            // <-- equal height with P&Q
      display="flex"
      flexDir="column"
    >
      <SectionHeader title="Mean values" />
      <Box p={3} flex="1">
        <LabelValue label="Mean Read Delay :" value={`${readDelayMs} ms`} />
        <LabelValue label="Mean Write Delay :" value={`${writeDelayMs} ms`} />
      </Box>
    </Box>
  );
};

export const PQCard: React.FC<{
  pAvailable: number;
  pDispatch: number;
  qAvailable: number;
  qDispatch: number;
}> = ({ pAvailable, pDispatch, qAvailable, qDispatch }) => {
  return (
    <Box
      rounded="lg"
      border="1px solid"
      borderColor="whiteAlpha.200"
      overflow="hidden"
      h="100%"            // <-- equal height with Mean values
      display="flex"
      flexDir="column"
    >
      <SectionHeader title="P & Q" />
      <Box flex="1" minH={0}>
        <Table size="sm">
          <Thead bg={useColorModeValue("blackAlpha.50", "whiteAlpha.100")}>
            <Tr>
              <Th> </Th>
              <Th isNumeric>Available</Th>
              <Th isNumeric>Dispatch</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>P(MW)</Td>
              <Td isNumeric>{pAvailable}</Td>
              <Td isNumeric>{pDispatch}</Td>
            </Tr>
            <Tr>
              <Td>Q(MVAr)</Td>
              <Td isNumeric>{qAvailable}</Td>
              <Td isNumeric>{qDispatch}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

/* ----------------------- control services (right) ----------------------- */

type SetpointCellProps = {
  value?: number;
  unit?: string;
  onChange?: (v: number) => void;
  placeholder?: string;
};

export const SetpointCell: React.FC<SetpointCellProps> = ({
  value,
  unit,
  onChange,
  placeholder,
}) => {
  return (
    <InputGroup size="sm" maxW="160px">
      <NumberInput
        value={value ?? ""}
        onChange={(_, n) => onChange?.(n)}
        clampValueOnBlur={false}
        precision={2}
      >
        <NumberInputField placeholder={placeholder} />
      </NumberInput>
      {unit && <InputRightAddon children={unit} />}
    </InputGroup>
  );
};

export const UpDownSetpointCell: React.FC<{
  up?: number;
  down?: number;
  unit?: string;
  onChange?: (v: { up?: number; down?: number }) => void;
}> = ({ up, down, unit = "", onChange }) => {
  return (
    <HStack spacing={2}>
      <HStack>
        <Badge>Up:</Badge>
        <SetpointCell
          value={up}
          unit={unit}
          onChange={(v) => onChange?.({ up: v, down })}
        />
      </HStack>
      <HStack>
        <Badge>Down:</Badge>
        <SetpointCell
          value={down}
          unit={unit}
          onChange={(v) => onChange?.({ up, down: v })}
        />
      </HStack>
    </HStack>
  );
};

export const ControlServiceRow: React.FC<{
  label: string;
  subLabel?: string;
  measurement: string | number;
  setpoint: React.ReactNode;
  status: "ok" | "warn" | "bad";
}> = ({ label, subLabel, measurement, setpoint, status }) => {
  return (
    <Tr>
      <Td>
        <VStack spacing={0} align="start">
          <Text fontWeight="medium">{label}</Text>
          {subLabel && (
            <Text fontSize="xs" color="gray.500" mt="-1">
              {subLabel}
            </Text>
          )}
        </VStack>
      </Td>
      <Td isNumeric>{measurement}</Td>
      <Td>{setpoint}</Td>
      <Td textAlign="center">
        <StatusDot status={status} />
      </Td>
    </Tr>
  );
};

export const ControlServicesCard: React.FC<{ rows: React.ReactNode }> = ({
  rows,
}) => {
  return (
    <Box
      overflowY="auto"
      h="340px"             // <-- fill column height
      display="flex"
      flexDir="column"
    >
      <SectionHeader title="Control Services" />
      <Box flex="1" minH={0} overflowY="auto">
        <Table size="sm">
          <Thead bg={useColorModeValue("blackAlpha.50", "whiteAlpha.100")}>
            <Tr>
              <Th>Control Services</Th>
              <Th isNumeric>Measurement</Th>
              <Th>Setpoint</Th>
              <Th textAlign="center">Status</Th>
            </Tr>
          </Thead>
          <Tbody>{rows}</Tbody>
        </Table>
      </Box>
    </Box>
  );
};

/* --------------------------- row layout --------------------------- */

const CARD_W = "330px"; // fixed width for left two columns

export const InverterWidgetDemo: React.FC = () => {
  const [activePower, setActivePower] = React.useState(15000);
  const [ramp, setRamp] = React.useState<{ up?: number; down?: number }>({
    up: 5000,
    down: 5000,
  });
  const [freq, setFreq] = React.useState(50.0);
  const [reactive, setReactive] = React.useState(-98.5);
  const [pf, setPf] = React.useState(1.0);

  return (
    <Grid
      templateColumns={{ base: "1fr", xl: `${CARD_W} ${CARD_W} 1fr` }}
      gap={4}
      p={2}
      w="100%"
      alignItems="stretch"   // <-- makes all three columns same height
    >
      {/* Col 1: Global Info */}
      <GridItem w={CARD_W} minW={CARD_W} maxW={CARD_W} h="100%">
        <GlobalInfoCard
          left={{
            "Stop": 10,
            "Grid connected": 40,
            "Power limit": 0,
            "Running": 30,
            "Power limit stop": 0,
          }}
          right={{
            "Fault": 1,
            "Derating": 0,
            "Comm. error": 0,
          }}
        />
        <MeanValuesCard readDelayMs={2.2} writeDelayMs={2.75} />
      </GridItem>

      {/* Col 2: Mean + P&Q split equally */}
      <GridItem w={CARD_W} minW={CARD_W} maxW={CARD_W} h="100%">
        <Grid templateRows="1fr 1fr" gap={4} h="100%">
          <PQCard pAvailable={100} pDispatch={100} qAvailable={100} qDispatch={100} />
        </Grid>
      </GridItem>

      {/* Col 3: Control services fills full height */}
      <GridItem h="400px">
        <Flex direction="column" h="100%"
        rounded="lg"
          border="1px solid"
      borderColor="whiteAlpha.200"
        >
          <ControlServicesCard
            rows={
              <>
                <ControlServiceRow
                  label="P"
                  measurement={827267.0}
                  setpoint={<SetpointCell value={activePower} unit="kW" onChange={setActivePower} />}
                  status="ok"
                />
                <ControlServiceRow
                  label="Ramp Rate/min"
                  subLabel=""
                  measurement={827.27}
                  setpoint={<UpDownSetpointCell up={ramp.up} down={ramp.down} unit="kW/min" onChange={setRamp} />}
                  status="ok"
                />
                <ControlServiceRow
                  label="P(f)"
                  measurement={"49.97 Hz"}
                  setpoint={<SetpointCell value={freq} unit="Hz" onChange={setFreq} />}
                  status="bad"
                />
                <ControlServiceRow
                  label="Q"
                  measurement={"0 kVAr"}
                  setpoint={<SetpointCell value={reactive} unit="kVAr" onChange={setReactive} />}
                  status="bad"
                />
                <ControlServiceRow
                  label="cosphi"
                  measurement={1}
                  setpoint={<SetpointCell value={pf} onChange={setPf} />}
                  status="ok"
                />
                <ControlServiceRow
                  label="V Droop"
                  measurement={1}
                  setpoint={<SetpointCell value={pf} onChange={setPf} />}
                  status="ok"
                />
                <ControlServiceRow
                  label="FRT"
                  measurement={1}
                  setpoint={<SetpointCell value={pf} onChange={setPf} />}
                  status="ok"
                />
              </>
            }
          />
          <HStack justify="flex-end" mt={3}>
            <Button size="sm" variant="outline">Reset</Button>
            <Button size="sm" colorScheme="green">Apply Setpoints</Button>
          </HStack>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default InverterWidgetDemo;
