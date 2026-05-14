import { useState } from "react";
import {
  Box,
  Text,
  Switch,
  HStack,
  VStack,
  Input,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";

const ReactivePowerControl = () => {
  const [enabled, setEnabled] = useState(false);
  const [pv, setPv] = useState(false);
  const [bess, setBess] = useState(false);
  const [strategy, setStrategy] = useState("pf_range");

  const panelBg = useColorModeValue("linear-gradient(145deg, #ffffff, #eef2f7)", "rgba(255,255,255,0.02)");
  const panelBorder = useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)");
  const panelShadow = useColorModeValue(`14px 14px 30px rgba(163,177,198,0.35), -12px -12px 28px rgba(255,255,255,0.95)`, `8px 8px 20px rgba(2,6,23,0.6)`);

  return (
    <Box bg={panelBg} border={panelBorder} borderRadius="28px" mb="10px" overflow="hidden" boxShadow={panelShadow}>

      {/* HEADER */}
      <Box px={6} py={5} bg={useColorModeValue("linear-gradient(90deg, #16202d, #23364b)", "linear-gradient(90deg,#0b2432,#132335)") }>
        <HStack justify="space-between">
          <Text fontSize="18px" fontWeight="800" color={useColorModeValue("white", "white")} letterSpacing="0.5px">Reactive Power Control</Text>

          <Switch size="sm" isChecked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        </HStack>
      </Box>

      {/*  EXPANDED CONTENT */}
      {enabled && (
        <Box p={6}>

          {/* TOP GRID */}
          <Box display="grid" gridTemplateColumns={{ base: "1fr", xl: "1.1fr 0.9fr" }} gap={5} mb={5}>

            {/* LEFT SIDE */}
            <Box borderRadius="30px" overflow="hidden" bg="rgba(255,255,255,0.78)" backdropFilter="blur(18px)" border="1px solid rgba(255,255,255,0.7)" boxShadow={`0 18px 40px rgba(15,23,42,0.08)`}>

              {/* PANEL HEADER */}
              <Box px={6} py={4} bg={useColorModeValue("linear-gradient(90deg, #0f172a, #1e293b)", "linear-gradient(90deg,#0f172a,#1e293b)") }>
                <Text fontSize="13px" fontWeight="700" color={useColorModeValue("white", "white")} letterSpacing="0.4px">CONTROLLED UNITS</Text>
              </Box>

              {/* BODY */}
              <Box p={5}>
                <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mb={5}>Units used to perform grid reactive power control.</Text>

                {/* PV CARD */}
                <Box borderRadius="22px" p={5} mb={4} bg={useColorModeValue("linear-gradient(135deg, #ffffff 0%, #f3f7fb 100%)", "rgba(255,255,255,0.02)")} border={panelBorder} boxShadow={useColorModeValue("0 12px 28px rgba(15,23,42,0.08)", "0 10px 24px rgba(2,6,23,0.6)") }>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")}>PV UNIT</Text>
                      <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mt={1}>Reactive support from solar inverters</Text>
                    </Box>

                    <Switch size="sm" isChecked={pv} onChange={(e) => setPv(e.target.checked)} />
                  </HStack>
                </Box>

                {/* BESS CARD */}
                <Box borderRadius="22px" p={5} bg={useColorModeValue("linear-gradient(135deg, #ffffff 0%, #f3f7fb 100%)", "rgba(255,255,255,0.02)")} border={panelBorder} boxShadow={useColorModeValue("0 12px 28px rgba(15,23,42,0.08)", "0 10px 24px rgba(2,6,23,0.6)") }>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")}>BESS UNIT</Text>
                      <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mt={1}>Reactive support from battery PCS</Text>
                    </Box>

                    <Switch size="sm" isChecked={bess} onChange={(e) => setBess(e.target.checked)} />
                  </HStack>
                </Box>

              </Box>
            </Box>

            {/* RIGHT SIDE */}
            <Box display="flex" flexDirection="column" gap={5}>

              {/* STRATEGY */}
              <Box borderRadius="30px" overflow="hidden" bg="rgba(255,255,255,0.78)" backdropFilter="blur(18px)" border="1px solid rgba(255,255,255,0.7)" boxShadow={`0 18px 40px rgba(15,23,42,0.08)`}>
                <Box px={5} py={4} borderBottom="1px solid rgba(255,255,255,0.5)">
                  <Text fontSize="12px" fontWeight="700" color="#172554">Reactive Control Strategy</Text>
                </Box>

                <Box p={5}>
                  <Text fontSize="11px" color="gray.600" mb={4}>Configure the operating logic for reactive compensation.</Text>

                  <Select size="sm" borderRadius="14px" bg="white" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                    <option value="pf_range">Power Factor Range</option>
                    <option value="pf_target">Power Factor Target</option>
                    <option value="qfu">Q = f(U)</option>
                  </Select>
                </Box>
              </Box>

              {/* WARNING */}
              {!pv && !bess && (
                <Box borderRadius="26px" p={5} bg="linear-gradient(135deg, #fff4f4 0%, #ffe8e8 100%)" border="1px solid rgba(255,180,180,0.4)" boxShadow={`0 12px 25px rgba(239,68,68,0.08)`}>
                  <Text fontSize="12px" fontWeight="700" color="#991b1b" mb={2}>WARNING</Text>
                  <Text fontSize="11px" color="#7f1d1d">No unit is configured for reactive control operation.</Text>
                </Box>
              )}

            </Box>

          </Box>

          {/*  PV SECTION */}
          {pv && (
            <Box borderRadius="30px" overflow="hidden" mb={5} bg="rgba(255,255,255,0.78)" backdropFilter="blur(18px)" border="1px solid rgba(255,255,255,0.7)" boxShadow={`0 18px 40px rgba(15,23,42,0.08)`}>

              {/* HEADER */}
              <Box px={6} py={4} bg="linear-gradient(90deg, #0f766e, #115e59)">
                <Text fontSize="13px" fontWeight="700" color="white" letterSpacing="0.4px">PV REACTIVE CONFIGURATION</Text>
              </Box>

              {/* BODY */}
              <Box p={6}>

                {/* LIMIT */}
                <Box borderRadius="22px" p={5} mb={5} bg="linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)" boxShadow={`0 12px 24px rgba(15,23,42,0.06)`}>
                  <HStack justify="space-between">
                    <Text fontSize="12px" fontWeight="600">Maximum Reactive Power Setpoint</Text>

                    <HStack>
                      <Input size="sm" w="80px" defaultValue="50" borderRadius="14px" bg="white" />
                      <Text fontSize="12px">kVAr</Text>
                    </HStack>
                  </HStack>
                </Box>

                {/* STRATEGY CONTENT */}
                {strategy === "pf_range" && (
                  <Box borderRadius="24px" overflow="hidden" bg="linear-gradient(135deg, #ffffff 0%, #edf3f9 100%)" boxShadow={`0 12px 24px rgba(15,23,42,0.06)`}>

                    <Box px={5} py={4} borderBottom="1px solid rgba(255,255,255,0.6)">
                      <Text fontSize="12px" fontWeight="700">Power Factor Range</Text>
                    </Box>

                    <Box p={5}>

                      <HStack justify="space-between" mb={4}>
                        <Text fontSize="12px">Minimum capacitive power factor</Text>
                        <Input size="sm" w="90px" borderRadius="14px" bg="white" />
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontSize="12px">Minimum inductive power factor</Text>
                        <Input size="sm" w="90px" borderRadius="14px" bg="white" />
                      </HStack>

                    </Box>
                  </Box>
                )}

                {strategy === "pf_target" && (
                  <Box borderRadius="24px" overflow="hidden" bg="linear-gradient(135deg, #ffffff 0%, #edf3f9 100%)" boxShadow={`0 12px 24px rgba(15,23,42,0.06)`}>

                    <Box px={5} py={4} borderBottom="1px solid rgba(255,255,255,0.6)">
                      <Text fontSize="12px" fontWeight="700">Power Factor Target</Text>
                    </Box>

                    <Box p={5}>

                      <HStack justify="space-between" mb={4}>
                        <Text fontSize="12px">Value</Text>
                        <Input size="sm" w="90px" defaultValue="0.98" borderRadius="14px" bg="white" />
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontSize="12px">Type</Text>
                        <Select size="sm" w="140px" borderRadius="14px" bg="white">
                          <option>Inductive</option>
                          <option>Capacitive</option>
                        </Select>
                      </HStack>

                    </Box>
                  </Box>
                )}

              </Box>
              {strategy === "qfu" && (
                <Box borderRadius="24px" overflow="hidden" bg="linear-gradient(135deg, #ffffff 0%, #edf3f9 100%)" boxShadow={`0 12px 24px rgba(15,23,42,0.06)`}>

                  {/* HEADER */}
                  <Box px={5} py={4} borderBottom="1px solid rgba(255,255,255,0.6)">
                    <Text fontSize="12px" fontWeight="700">Q = f(U) Reactive Control</Text>
                    <Text fontSize="11px" color="gray.600" mt={1}>Reactive power follows the configured voltage function curve.</Text>
                  </Box>

                  {/* BODY */}
                  <Box p={5}>

                    {/* NOMINAL VOLTAGE */}
                    <HStack justify="space-between" mb={4}>
                      <Text fontSize="12px">Nominal phase to phase voltage</Text>
                      <HStack>
                        <Input size="sm" w="90px" borderRadius="14px" bg="white" />
                        <Text fontSize="12px">kV</Text>
                      </HStack>
                    </HStack>

                    {/* MAX CAPACITIVE */}
                    <HStack justify="space-between" mb={4}>
                      <Text fontSize="12px">Maximum capacitive reactive power</Text>
                      <HStack>
                        <Input size="sm" w="90px" borderRadius="14px" bg="white" />
                        <Text fontSize="12px">kVAr</Text>
                      </HStack>
                    </HStack>

                    {/* MAX INDUCTIVE */}
                    <HStack justify="space-between" mb={5}>
                      <Text fontSize="12px">Maximum inductive reactive power</Text>
                      <HStack>
                        <Input size="sm" w="90px" borderRadius="14px" bg="white" />
                        <Text fontSize="12px">kVAr</Text>
                      </HStack>
                    </HStack>

                    {/* VOLTAGE CURVE */}
                    <Box borderRadius="20px" p={5} bg="linear-gradient(135deg, #f8fbff 0%, #edf2f7 100%)" border="1px solid rgba(255,255,255,0.7)">

                      <Text fontSize="12px" fontWeight="700" color="#172554" mb={4}>Voltage Variation Curve</Text>

                      <VStack spacing={3} align="stretch">

                        <HStack justify="space-between">
                          <Text fontSize="12px">Negative voltage variation: start of the constant capacitive zone</Text>
                          <HStack>
                            <Input size="sm" w="90px" borderRadius="14px" bg="white" defaultValue="-4" textAlign="right" />
                            <Text fontSize="12px">%</Text>
                          </HStack>
                        </HStack>

                        <HStack justify="space-between">
                          <Text fontSize="12px">Negative voltage variation: start of the linear capacitive zone</Text>
                          <HStack>
                            <Input size="sm" w="90px" borderRadius="14px" bg="white" defaultValue="-2.75" textAlign="right" />
                            <Text fontSize="12px">%</Text>
                          </HStack>
                        </HStack>

                        <HStack justify="space-between">
                          <Text fontSize="12px">Positive voltage variation: start of the linear inductive zone</Text>
                          <HStack>
                            <Input size="sm" w="90px" borderRadius="14px" bg="white" defaultValue="3.75" textAlign="right" />
                            <Text fontSize="12px">%</Text>
                          </HStack>
                        </HStack>

                        <HStack justify="space-between">
                          <Text fontSize="12px">Positive voltage variation: start of the constant inductive zone</Text>
                          <HStack>
                            <Input size="sm" w="90px" borderRadius="14px" bg="white" defaultValue="5" textAlign="right" />
                            <Text fontSize="12px">%</Text>
                          </HStack>
                        </HStack>

                      </VStack>
                    </Box>

                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/*  BESS SECTION */}
          {bess && (
            <Box borderRadius="30px" overflow="hidden" bg="rgba(255,255,255,0.78)" backdropFilter="blur(18px)" border="1px solid rgba(255,255,255,0.7)" boxShadow={`0 18px 40px rgba(15,23,42,0.08)`}>

              <Box px={6} py={4} bg="linear-gradient(90deg, #1d4ed8, #1e40af)">
                <Text fontSize="13px" fontWeight="700" color="white" letterSpacing="0.4px">BESS REACTIVE CONFIGURATION</Text>
              </Box>

              <Box p={6}>

                <Box borderRadius="22px" p={5} mb={5} bg="linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)" boxShadow={`0 12px 24px rgba(15,23,42,0.06)`}>
                  <HStack justify="space-between">
                    <Text fontSize="12px" fontWeight="600">Maximum Reactive Power Setpoint</Text>

                    <HStack>
                      <Input size="sm" w="80px" defaultValue="50" borderRadius="14px" bg="white" />
                      <Text fontSize="12px">kVAr</Text>
                    </HStack>
                  </HStack>
                </Box>

                <Box borderRadius="22px" p={5} bg="linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)" boxShadow={`0 12px 24px rgba(15,23,42,0.06)`}>
                  <HStack justify="space-between" align="flex-start">
                    <Box>
                      <Text fontSize="12px" fontWeight="600">Leading Control Unit</Text>
                      <Text fontSize="11px" color="gray.600" mt={1} maxW="600px">The leading unit covers the reactive power demand until its operational limit is reached.</Text>
                    </Box>

                    <Select size="sm" w="140px" borderRadius="14px" bg="white">
                      <option>PV</option>
                      <option>BESS</option>
                    </Select>
                  </HStack>
                </Box>

              </Box>
            </Box>
          )}

        </Box>
      )}

    </Box>
  );
};

export default ReactivePowerControl;
