import React, { useState } from "react";
import {
  Box,
  Text,
  Switch,
  Input,
  VStack,
  HStack,
  Button,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import AutomaticGensetControl from "../components/DashboardComponents/GensetComponents/AutomaticGensetControl";
import GensetCommitmentStrategy from "../components/DashboardComponents/GensetComponents/GensetCommitmentStrategy";
/* ----------- SECTION ----------- */
const Section = ({
  title,
  unit,
}: {
  title: string;
  unit: string;
}) => {
  const cardBg = useColorModeValue("white", "#0f172a");
  const headerBg = useColorModeValue("#fafafa", "#081226");
  const borderColor = useColorModeValue("#e5e5e5", "rgba(255,255,255,0.06)");
  const titleColor = useColorModeValue("#172554", "#cbd5e1");

  return (
    <Box
      w="100%"
      bg={cardBg}
      mb="6px"
      border={`1px solid ${borderColor}`}
      boxShadow={useColorModeValue("0 1px 2px rgba(0,0,0,0.08)", "0 1px 2px rgba(0,0,0,0.02)")}
    >
      <Box bg={headerBg} px={4} py={2}>
        <Text fontSize="13px" fontWeight="600" color={titleColor}>
          {title}
        </Text>
      </Box>

      <Box px={4} py={2} borderTop={`1px solid ${useColorModeValue("#eee", "rgba(255,255,255,0.04)")}`}>
        <HStack justify="space-between">
          <Text fontSize="12px">Meter 2</Text>

          <HStack spacing={2}>
            <Input
              size="sm"
              defaultValue="0"
              w="60px"
              h="24px"
              textAlign="right"
            />
            <Text fontSize="12px">{unit}</Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

/* ----------- EXPANDABLE: MIN PHASE ----------- */
const ExpandableMinPhase = () => {
  const [enabled, setEnabled] = useState(false);
  const cardBg = useColorModeValue("white", "#071226");
  const innerBg = useColorModeValue("#fafafa", "#041025");
  const borderColor = useColorModeValue("#e5e5e5", "rgba(255,255,255,0.04)");

  return (
    <Box
      bg={cardBg}
      mb="6px"
      border={`1px solid ${borderColor}`}
      boxShadow={useColorModeValue("0 1px 2px rgba(0,0,0,0.08)", "0 1px 2px rgba(0,0,0,0.02)")}
    >
      <Box px={4} py={2}>
          <HStack justify="space-between">
          <Text fontSize="13px" color={useColorModeValue("#172554", "#cbd5e1")}>
            Activate minimum phase power control in genset prime
          </Text>
          <Switch
            size="sm"
            isChecked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </HStack>
      </Box>

      {enabled && (
        <Box bg={innerBg} px={4} py={2} borderTop={`1px solid ${useColorModeValue("#eee", "rgba(255,255,255,0.03)")}`}>
          <HStack justify="space-between" mb={1}>
            <Text fontSize="12px" fontWeight="500">
              Minimum allowed genset phase power
            </Text>

            <HStack spacing={2}>
              <Input size="sm" defaultValue="1" w="60px" />
              <Text fontSize="12px">kW</Text>
            </HStack>
          </HStack>

          <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")}>
            If the power of one of the genset phases reaches the configured threshold,
            the EMS will control other devices to increase genset power production.
          </Text>
        </Box>
      )}
    </Box>
  );
};

/* ----------- EXPANDABLE: REACTIVE POWER ----------- */
const ReactivePowerControl = () => {
  const [enabled, setEnabled] = useState(false);
  const [pvEnabled, setPvEnabled] = useState(false);
  const [strategy, setStrategy] = useState("range");
  const cardBg = useColorModeValue("white", "#071226");
  const innerBg = useColorModeValue("#fafafa", "#041025");
  const borderColor = useColorModeValue("#e5e5e5", "rgba(255,255,255,0.04)");

  return (
    <Box
      bg={cardBg}
      mb="6px"
      border={`1px solid ${borderColor}`}
      boxShadow={useColorModeValue("0 1px 2px rgba(0,0,0,0.08)", "0 1px 2px rgba(0,0,0,0.02)")}
    >
      {/* MAIN HEADER */}
      <Box px={4} py={2}>
        <HStack justify="space-between">
          <Text fontSize="13px" color={useColorModeValue("#172554", "#cbd5e1")}>
            Activate Reactive Power Control
          </Text>
          <Switch
            size="sm"
            isChecked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </HStack>
      </Box>

      {/* FIRST LEVEL EXPAND */}
      {enabled && (
        <Box bg={innerBg} px={4} py={3} borderTop={`1px solid ${useColorModeValue("#eee", "rgba(255,255,255,0.03)")}`}>

          {/* CONTROLLED UNITS */}
          <Text fontSize="12px" fontWeight="600" mb={1} color={useColorModeValue("#172554", "#cbd5e1")}>
            Controlled units
          </Text>

          <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mb={2}>
            Units used to perform genset reactive power control.
          </Text>

          {/* PV ROW */}
          <Box
            bg={cardBg}
            border={`1px solid ${useColorModeValue("#ddd", "rgba(255,255,255,0.03)")}`}
            px={3}
            py={2}
            mb={3}
          >
            <HStack justify="space-between">
              <Text fontSize="12px" color={useColorModeValue("#172554", "#cbd5e1")}>
                PV
              </Text>
              <Switch
                size="sm"
                isChecked={pvEnabled}
                onChange={(e) => setPvEnabled(e.target.checked)}
              />
            </HStack>
          </Box>

          {/* SECOND LEVEL EXPAND (PV ENABLED) */}
          {pvEnabled && (
            <Box
              bg={innerBg}
              border={`1px solid ${useColorModeValue("#ddd", "rgba(255,255,255,0.03)")}`}
              p={3}
              mb={3}
            >
              {/* MAX REACTIVE POWER */}
              <HStack justify="space-between" mb={3}>
                <Text fontSize="12px">
                  Maximum absolute value of reactive power setpoint for PV
                </Text>

                <HStack spacing={2}>
                  <Input size="sm" defaultValue="5" w="60px" />
                  <Text fontSize="12px">kVAr</Text>
                </HStack>
              </HStack>

              {/* STRATEGY */}
              <HStack justify="space-between" mb={3}>
                <Text fontSize="12px">Reactive power control strategy</Text>

                <Select
                  size="sm"
                  w="180px"
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                >
                  <option value="range">Power Factor Range</option>
                  <option value="target">Power Factor Target</option>
                </Select>
              </HStack>

              {/* CONDITION BASED UI */}
              {strategy === "range" ? (
                <>
                  <Text fontSize="12px" fontWeight="600" mb={1}>
                    Power Factor Range Based Reactive Power Control
                  </Text>

                  <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mb={3}>
                    The configured unit is controlled so that the power factor of the genset stays within configured power factor range.
                  </Text>

                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="12px">Minimum Capacitive Power Factor</Text>
                    <Input size="sm" w="60px" />
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="12px">Minimum Inductive Power Factor</Text>
                    <Input size="sm" w="60px" />
                  </HStack>
                </>
              ) : (
                <>
                  <Text fontSize="12px" fontWeight="600" mb={1}>
                    Power Factor Target Based Reactive Power Control
                  </Text>

                  <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mb={3}>
                    The configured unit is controlled to maintain a fixed power factor target.
                  </Text>

                  <>
  {/* TITLE */}
              <Text fontSize="12px" fontWeight="600" mb={1} color={useColorModeValue("#172554", "#cbd5e1")}>
                    Power Factor Target Based Reactive Power Control
                  </Text>

  {/* DESCRIPTION */}
                  <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mb={3}>
    The configured unit is controlled so that the power factor of the gensets stays equal to the configured power factor target.
  </Text>

  {/* SECTION LABEL */}
  <Text fontSize="12px" fontWeight="600" mb={2} color={useColorModeValue("#172554", "#cbd5e1")}>
    Power Factor Target
  </Text>

  {/* VALUE */}
  <HStack justify="space-between" mb={2}>
    <Text fontSize="12px" color={useColorModeValue("#172554", "#cbd5e1")}>Value</Text>
    <Input size="sm" w="80px" />
  </HStack>

  {/* TYPE */}
  <HStack justify="space-between">
    <Text fontSize="12px" color={useColorModeValue("#172554", "#cbd5e1")}>Type</Text>
    <Select size="sm" w="140px">
      <option>Inductive</option>
      <option>Capacitive</option>
    </Select>
  </HStack>
</>
                </>
              )}
            </Box>
          )}

          {/* WARNING */}
          {!pvEnabled && (
            <>
              <Text fontSize="12px" fontWeight="600">
                WARNING
              </Text>
                  <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")}>
                No unit is configured for the reactive control to operate properly.
              </Text>
            </>
          )}

        </Box>
      )}
    </Box>
  );
};

/* ----------- NORMAL SWITCH ----------- */
const SwitchRow = ({ label }: { label: string }) => {
  const cardBg = useColorModeValue("white", "#071226");
  const borderColor = useColorModeValue("#e5e5e5", "rgba(255,255,255,0.04)");

  return (
    <Box
      bg={cardBg}
      px={4}
      py={2}
      mb="6px"
      border={`1px solid ${borderColor}`}
      boxShadow={useColorModeValue("0 1px 2px rgba(0,0,0,0.08)", "0 1px 2px rgba(0,0,0,0.02)")}
    >
      <HStack justify="space-between">
        <Text fontSize="13px">{label}</Text>
        <Switch size="sm" />
      </HStack>
    </Box>
  );
};

/* ----------- MAIN UI ----------- */
export default function GensetControlUI() {
  const containerBg = useColorModeValue("linear-gradient(135deg, #edf2f7 0%, #dde7f2 100%)", "linear-gradient(135deg,#071226 0%,#041025 100%)");
  const containerBorder = useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)");
  const containerShadow = useColorModeValue(`0 25px 60px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.95)`, `0 18px 40px rgba(2,6,23,0.6)`);
  const glowA = useColorModeValue("rgba(0,255,200,0.10)", "rgba(0,255,180,0.06)");
  const glowB = useColorModeValue("rgba(59,130,246,0.10)", "rgba(59,130,246,0.04)");

  const panelBg = useColorModeValue("rgba(255,255,255,0.78)", "rgba(255,255,255,0.03)");
  const panelBorder = useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)");
  const panelShadow = useColorModeValue("0 18px 40px rgba(15,23,42,0.08)", "0 12px 28px rgba(2,6,23,0.6)");

  return (
    <Box w="100%" position="relative" overflow="hidden" borderRadius="34px" p={6} bg={containerBg} border={containerBorder} boxShadow={containerShadow}>

      {/* GLOW EFFECTS */}
      <Box position="absolute" top="-120px" right="-120px" w="320px" h="320px" borderRadius="full" bg={glowA} filter="blur(90px)" />

      <Box position="absolute" bottom="-120px" left="-120px" w="300px" h="300px" borderRadius="full" bg={glowB} filter="blur(90px)" />

      <VStack spacing={6} align="stretch" position="relative" zIndex={2}>

        {/*  TOP HEADER */}
        <Box borderRadius="30px" overflow="hidden" bg="linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0b1220 100%)" boxShadow={`0 18px 45px rgba(15,23,42,0.20)`}>
          <Box h="3px" bg="linear-gradient(90deg, #00d9b8, #3b82f6, #8b5cf6)" />

          <Box p={6}>
            <Text fontSize="18px" fontWeight="800" color="white" letterSpacing="0.4px">Genset Power Management</Text>
            <Text fontSize="11px" color="rgba(255,255,255,0.72)" mt={1}>Advanced EMS genset synchronization & reactive power optimization</Text>

            <HStack mt={5} spacing={4} flexWrap="wrap">
              <Box px={4} py={3} borderRadius="18px" bg="rgba(255,255,255,0.08)" border="1px solid rgba(255,255,255,0.08)" backdropFilter="blur(14px)">
                <Text fontSize="10px" color="rgba(255,255,255,0.6)">Genset Mode</Text>
                <Text fontSize="12px" fontWeight="800" color="white" mt={1}>PRIME</Text>
              </Box>

              <Box px={4} py={3} borderRadius="18px" bg="rgba(255,255,255,0.08)" border="1px solid rgba(255,255,255,0.08)" backdropFilter="blur(14px)">
                <Text fontSize="10px" color="rgba(255,255,255,0.6)">Reactive Mode</Text>
                <Text fontSize="12px" fontWeight="800" color="white" mt={1}>PF CONTROL</Text>
              </Box>

              <Box px={4} py={3} borderRadius="18px" bg="rgba(255,255,255,0.08)" border="1px solid rgba(255,255,255,0.08)" backdropFilter="blur(14px)">
                <Text fontSize="10px" color="rgba(255,255,255,0.6)">Grid Status</Text>
                <Text fontSize="12px" fontWeight="800" color="#8fffd7" mt={1}>CONNECTED</Text>
              </Box>
            </HStack>
          </Box>
        </Box>

        {/*  TOP CONFIG GRID */}
        <Box display="grid" gridTemplateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={5}>
          <Box display="flex" flexDirection="column" gap={5}>
            <Section title="Genset rated apparent power values" unit="kVA" />
            <Section title="Genset maximum power values in following mode" unit="kW" />
            <ExpandableMinPhase />
          </Box>

          <Box display="flex" flexDirection="column" gap={5}>
            <Section title="Genset minimum loading" unit="%" />

            <Box borderRadius="28px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={panelBorder} boxShadow={panelShadow}>
              <Box px={5} py={4} bg="linear-gradient(90deg, #1d4ed8, #1e40af)">
                <Text fontSize="13px" fontWeight="700" color="white" letterSpacing="0.4px">QUICK CONTROL</Text>
              </Box>

              <Box p={5}>
                <SwitchRow label="Enable Automatic Synchronization" />
                <SwitchRow label="Enable Dynamic Load Sharing" />
                <SwitchRow label="Enable Frequency Stabilization" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/*  REACTIVE POWER SECTION */}
        <Box borderRadius="30px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={panelBorder} boxShadow={panelShadow} p={4}>
          <ReactivePowerControl />
        </Box>

        {/*  AUTOMATIC GENSET */}
        <Box borderRadius="30px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={panelBorder} boxShadow={panelShadow} p={4}>
          <AutomaticGensetControl />
        </Box>

        {/*  COMMITMENT STRATEGY */}
        <Box borderRadius="30px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={panelBorder} boxShadow={panelShadow} p={4}>
          <GensetCommitmentStrategy />
        </Box>

        {/*  SAVE BUTTON */}
        <Button h="60px" borderRadius="24px" position="relative" overflow="hidden" bg="linear-gradient(135deg, #ffd84d 0%, #f2b600 50%, #ffb300 100%)" color="#1f2937" fontSize="17px" fontWeight="800" letterSpacing="0.5px" boxShadow={`0 20px 40px rgba(242,182,0,0.30)`} _before={{ content: '""', position: "absolute", top: 0, left: "-120%", width: "70%", height: "100%", bg: "rgba(255,255,255,0.35)", transform: "skewX(-20deg)", transition: "0.7s" }} sx={{ "&:hover::before": { left: "140%" } }} _hover={{ transform: "translateY(-2px)" }}>
          SAVE CONFIGURATION
        </Button>
      </VStack>
    </Box>
  );
}