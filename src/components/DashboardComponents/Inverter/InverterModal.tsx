import React from "react";
import {
  Box,
  Flex,
  Text,
  Grid,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
} from "@chakra-ui/react";

/* Components */
import InfoRow from "./InfoRow";
import PerformanceRatioChart from "./PerformanceRatioChart";
import ParametersSection from "./ParametersSection";
import TemperatureGaugesSection from "./TemperatureGaugesSection";
import StatusSection from "./StatusSection";
import ACvsDCGraph from "./ACvsDCGraph";
import IGBTTempGraph from "./IGBTTempGraph";
import CurrentGraph from "./CurrentGraph";

/* ================= TYPES ================= */

interface InverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId?: string;
  containerRef: React.RefObject<HTMLElement>;
  selectedInverter: {
    name?: string;
    make?: string;
    model?: string;
    serialNumber?: string;
    acCapacity?: string;
    connectedDc?: string;
    commissionedOn?: string;
    operatingTime?: string;
    parameters?: {
      dcVoltageCurrent1?: string;
      dcVoltageCurrent2?: string;
      acVoltage?: string;
      acCurrent?: string;
      frequencyPf?: string;
    };
    performanceRatio?: string;
  } | null;
}

/* ================= COMPONENT ================= */

const InverterModal: React.FC<InverterModalProps> = ({
  isOpen,
  onClose,
  selectedInverter,
  deviceId,
  containerRef,
}) => {
  if (!isOpen || !selectedInverter) return null;

  /* SAFE FALLBACK */
  const params = selectedInverter.parameters ?? {};

  /* THEME */
  const modalBg = useColorModeValue("#F8FAFC", "#161B1B");
  const headerBg = useColorModeValue("#FFFFFF", "#161B1B");
  const cardBg = useColorModeValue("#FFFFFF", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const sectionTitle = useColorModeValue("gray.800", "gray.100");
  const labelMuted = useColorModeValue("gray.600", "gray.300");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      blockScrollOnMount={false}
      portalProps={{ containerRef }}
    >
      <ModalOverlay bg="transparent" />
      <ModalContent
        maxW="1200px"
        bg={modalBg}
        borderRadius="8px"
        boxShadow="lg"
        sx={{
          marginLeft: "auto",
          marginRight: "1.5rem",
          marginTop: "6rem",
        }}
      >
        {/* ===== HEADER ===== */}
        <ModalHeader p={0}>
          <Box bg={headerBg} borderRadius="8px" px={4} py={3}>
            <Text fontSize="14px" fontWeight="700">
              {selectedInverter.name ?? "Inverter"}
            </Text>
          </Box>
        </ModalHeader>

        <ModalCloseButton />

        {/* ===== BODY ===== */}
        <ModalBody p={4} maxH="calc(100vh - 10rem)" overflowY="auto">
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            {/* Inverter Info */}
            <Box bg={cardBg} border="1px solid" borderColor={cardBorder} p={4}>
              <Text fontSize="14px" fontWeight="700" mb={2} color={sectionTitle}>
                Inverter Info
              </Text>
              <VStack align="stretch" spacing={1}>
                <InfoRow left="Make" right={selectedInverter.make ?? "--"} />
                <InfoRow left="Model" right={selectedInverter.model ?? "--"} />
                <InfoRow left="S/N" right={selectedInverter.serialNumber ?? "--"} />
                <InfoRow left="AC Capacity" right={selectedInverter.acCapacity ?? "--"} />
                <InfoRow left="Connected DC" right={selectedInverter.connectedDc ?? "--"} />
                <InfoRow left="Commissioned On" right={selectedInverter.commissionedOn ?? "--"} />
                <InfoRow left="Operating Time" right={selectedInverter.operatingTime ?? "--"} />
              </VStack>
            </Box>

            {/* Parameters */}
            <Box bg={cardBg} border="1px solid" borderColor={cardBorder} p={4}>
              <Text fontSize="14px" fontWeight="700" mb={2} color={sectionTitle}>
                Parameters
              </Text>
              <VStack spacing={1} fontSize="13px" color={labelMuted} align="stretch">
                <Flex justify="space-between">
                  <Text>DC V/I 1</Text>
                  <Text>{params.dcVoltageCurrent1 ?? "--"}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>DC V/I 2</Text>
                  <Text>{params.dcVoltageCurrent2 ?? "--"}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>AC Voltage</Text>
                  <Text>{params.acVoltage ?? "--"}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>AC Current</Text>
                  <Text>{params.acCurrent ?? "--"}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Frequency / PF</Text>
                  <Text>{params.frequencyPf ?? "--"}</Text>
                </Flex>
              </VStack>
            </Box>

            {/* Performance Ratio */}
            <Box bg={cardBg} border="1px solid" borderColor={cardBorder} p={4}>
              {deviceId && <PerformanceRatioChart deviceId={deviceId} />}
            </Box>

            {/* LEFT SECTION */}
            <Box gridColumn={{ base: "1 / -1", md: "1 / 3" }}>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                {deviceId && <ParametersSection deviceId={deviceId} />}
                {deviceId && <TemperatureGaugesSection deviceId={deviceId} />}
              </Grid>

              {deviceId && <Box mt={-2}><CurrentGraph deviceId={deviceId} /></Box>}
              {deviceId && <Box mt={4}><StatusSection deviceId={deviceId} /></Box>}
            </Box>

            {/* RIGHT SECTION */}
            <Box gridColumn={{ base: "1 / -1", md: "3 / 4" }}>
              <VStack spacing={4}>
                {deviceId && <Box mt={-6}><ACvsDCGraph deviceId={deviceId} /></Box>}
                {deviceId && <Box mt={-5}><IGBTTempGraph deviceId={deviceId} /></Box>}
              </VStack>
            </Box>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InverterModal;
