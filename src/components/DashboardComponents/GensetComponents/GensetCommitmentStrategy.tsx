import {
  Box,
  Text,
  HStack,
  Select,
  Input,
  VStack,
  Grid,
  GridItem,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

const InfoCard = ({ title, description, children }: any) => {
  const bg = useColorModeValue(
    "linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)",
    "rgba(255,255,255,0.02)"
  );
  const border = useColorModeValue(
    "1px solid rgba(255,255,255,0.7)",
    "1px solid rgba(255,255,255,0.04)"
  );
  const shadow = useColorModeValue(
    `0 12px 28px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.95)`,
    `0 10px 24px rgba(2,6,23,0.6)`
  );

  return (
    <Box borderRadius="24px" overflow="hidden" bg={bg} border={border} boxShadow={shadow}>
      <Box p={5}>
        <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")}>
          {title}
        </Text>

        {description && (
          <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mt={2} lineHeight="20px">
            {description}
          </Text>
        )}

        <Box mt={4}>{children}</Box>
      </Box>
    </Box>
  );
};

const GensetCommitmentStrategy = () => {
  const [mode, setMode] = useState("startAll");

  const containerBg = useColorModeValue(
    "linear-gradient(135deg, #edf2f7 0%, #dde7f2 100%)",
    "linear-gradient(135deg,#071226 0%,#041025 100%)"
  );
  const containerBorder = useColorModeValue("1px solid rgba(255,255,255,0.75)", "1px solid rgba(255,255,255,0.04)");
  const containerShadow = useColorModeValue(
    `0 25px 55px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.95)`,
    `0 18px 40px rgba(2,6,23,0.6)`
  );

  return (
    <Box position="relative" overflow="hidden" borderRadius="34px" bg={containerBg} border={containerBorder} boxShadow={containerShadow} p={6}>

      {/* GLOW EFFECTS */}
      <Box position="absolute" top="-120px" right="-120px" w="300px" h="300px" borderRadius="full" bg={useColorModeValue("rgba(59,130,246,0.10)", "rgba(59,130,246,0.04)")} filter="blur(90px)" />

      <Box position="absolute" bottom="-120px" left="-120px" w="280px" h="280px" borderRadius="full" bg={useColorModeValue("rgba(0,255,200,0.10)", "rgba(0,255,180,0.04)")} filter="blur(90px)" />

      <VStack spacing={6} align="stretch" position="relative" zIndex={2}>

        {/*  HEADER */}
        <Box borderRadius="30px" overflow="hidden" bg="linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0b1220 100%)" boxShadow={`0 18px 45px rgba(15,23,42,0.20)`}>

          <Box h="3px" bg="linear-gradient(90deg, #00d9b8, #3b82f6, #8b5cf6)" />

          <Box p={6}>

            <Text fontSize="18px" fontWeight="800" color="white" letterSpacing="0.5px">Genset Commitment Strategy</Text>

            <Text fontSize="11px" color="rgba(255,255,255,0.72)" mt={1}>Intelligent genset dispatch & adaptive capacity optimization</Text>

            {/* STATUS BADGES */}
            <HStack mt={5} spacing={3} flexWrap="wrap">

              <Badge px={3} py={1} borderRadius="12px" bg="rgba(255,255,255,0.08)" color="white" fontSize="10px" fontWeight="700">EMS ACTIVE</Badge>

              <Badge px={3} py={1} borderRadius="12px" bg="rgba(0,255,170,0.12)" color="#9fffd7" fontSize="10px" fontWeight="700">LOAD BALANCING</Badge>

              <Badge px={3} py={1} borderRadius="12px" bg="rgba(255,184,0,0.12)" color="#ffe08a" fontSize="10px" fontWeight="700">SMART COMMITMENT</Badge>

            </HStack>

          </Box>
        </Box>

        {/*  STRATEGY SELECTOR */}
        <Box borderRadius="30px" overflow="hidden" bg={useColorModeValue("rgba(255,255,255,0.78)", "rgba(255,255,255,0.03)")} backdropFilter="blur(18px)" border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 18px 40px rgba(15,23,42,0.08)", "0 12px 28px rgba(2,6,23,0.6)") }>

          {/* HEADER */}
          <Box px={6} py={4} bg={useColorModeValue("linear-gradient(90deg, #1d4ed8, #1e40af)", "linear-gradient(90deg,#0b3a66,#05263f)") }>
            <HStack justify="space-between">

              <Box>
                <Text fontSize="13px" fontWeight="700" color="white" letterSpacing="0.4px">COMMITMENT STRATEGY MODE</Text>

                <Text fontSize="11px" color="rgba(255,255,255,0.72)" mt={1}>Configure genset commitment logic</Text>
              </Box>

              <Select size="sm" w="170px" value={mode} onChange={(e) => setMode(e.target.value)} bg={useColorModeValue("white", "#071226")} borderRadius="14px" fontWeight="600">
                <option value="startAll">Start all</option>
                <option value="startOne">Start one</option>
                <option value="adaptive">Adaptive</option>
              </Select>

            </HStack>
          </Box>

          {/* BODY */}
          <Box p={6}>

            <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={5}>

              {/* DESCRIPTION */}
              <GridItem>

                {mode === "startAll" && (
                  <InfoCard title="Start All Strategy" description="Start all gensets in the genset subsystem.">

                    <Box borderRadius="18px" p={4} bg="rgba(16,185,129,0.08)">
                      <Text fontSize="11px" color="#065f46" lineHeight="20px">This strategy provides maximum power availability and fast load sharing response.</Text>
                    </Box>

                  </InfoCard>
                )}

                {mode === "startOne" && (
                  <InfoCard title="Start One Strategy" description="Start only the genset with the lowest total engine runtime value.">

                    <Box borderRadius="18px" p={4} bg="rgba(59,130,246,0.08)">
                      <Text fontSize="11px" color="#1e3a8a" lineHeight="20px">Runtime balancing ensures uniform wear distribution across gensets.</Text>
                    </Box>

                  </InfoCard>
                )}

                {mode === "adaptive" && (
                  <InfoCard title="Adaptive Strategy" description="Dynamically adapt the number of gensets based on required active power.">

                    <Box borderRadius="18px" p={4} bg="rgba(245,158,11,0.10)">
                      <Text fontSize="11px" color="#92400e" lineHeight="20px">EMS automatically optimizes genset count for efficiency and load demand.</Text>
                    </Box>

                  </InfoCard>
                )}

              </GridItem>

              {/* STATUS PANEL */}
              <GridItem>

                <Box borderRadius="24px" p={5} h="100%" bg={useColorModeValue("linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)", "rgba(255,255,255,0.02)")} border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 12px 28px rgba(15,23,42,0.06)", "0 10px 24px rgba(2,6,23,0.6)") }>

                  <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")} mb={5}>Strategy Analytics</Text>

                  <Grid templateColumns="1fr 1fr" gap={4}>

                    <Box p={4} borderRadius="18px" bg={useColorModeValue("#f8fafc", "#071226")}>
                      <Text fontSize="10px" color={useColorModeValue("gray.500", "gray.400")}>Active Mode</Text>

                      <Text fontSize="12px" fontWeight="800" mt={1} color={useColorModeValue("#172554", "#cbd5e1")}>
                        {mode === "startAll" ? "START ALL" : mode === "startOne" ? "START ONE" : "ADAPTIVE"}
                      </Text>
                    </Box>

                    <Box p={4} borderRadius="18px" bg={useColorModeValue("#f8fafc", "#071226")}>
                      <Text fontSize="10px" color={useColorModeValue("gray.500", "gray.400")}>Dispatch Logic</Text>

                      <Text fontSize="12px" fontWeight="800" mt={1} color={useColorModeValue("#172554", "#cbd5e1")}>
                        SMART EMS
                      </Text>
                    </Box>

                  </Grid>

                </Box>

              </GridItem>

            </Grid>

          </Box>
        </Box>

        {/*  ADAPTIVE EXTRA */}
        {mode === "adaptive" && (
          <Box borderRadius="30px" overflow="hidden" bg={useColorModeValue("rgba(255,255,255,0.78)", "rgba(255,255,255,0.03)")} backdropFilter="blur(18px)" border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 18px 40px rgba(15,23,42,0.08)", "0 12px 28px rgba(2,6,23,0.6)") }>

            <Box px={6} py={4} bg={useColorModeValue("linear-gradient(90deg, #0f766e, #115e59)", "linear-gradient(90deg,#0b4f45,#08353a)") }>
              <Text fontSize="13px" fontWeight="700" color="white" letterSpacing="0.4px">ADAPTIVE CONFIGURATION</Text>
            </Box>

            <Box p={6}>

              <InfoCard title="Minimum genset runtime" description="Minimum time the genset must run after activation.">

                <HStack justify="flex-end">
                  <Input size="sm" w="90px" defaultValue="10" textAlign="center" borderRadius="14px" bg={useColorModeValue("white","#071226")} border="none" />

                  <Text fontSize="12px" fontWeight="600">minutes</Text>
                </HStack>

              </InfoCard>

            </Box>
          </Box>
        )}

        {/*  COMMON FIELD */}
        <Box borderRadius="30px" overflow="hidden" bg={useColorModeValue("rgba(255,255,255,0.78)", "rgba(255,255,255,0.03)")} backdropFilter="blur(18px)" border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 18px 40px rgba(15,23,42,0.08)", "0 12px 28px rgba(2,6,23,0.6)") }>

          <Box px={6} py={4} bg={useColorModeValue("linear-gradient(90deg, #7c3aed, #6d28d9)", "linear-gradient(90deg,#3a2b58,#111224)") }>
            <Text fontSize="13px" fontWeight="700" color="white" letterSpacing="0.4px">TARGET CAPACITY COMPUTATION</Text>
          </Box>

          <Box p={6}>

            <Grid templateColumns={{ base: "1fr", xl: "1.2fr 0.8fr" }} gap={5} alignItems="center">

              <GridItem>

                <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")}>
                  Target capacity computation horizon (expert)
                </Text>

                <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mt={2} lineHeight="22px">
                  The adaptive commitment strategy uses moving averages of the observed magnitudes to compute the number of gensets required.
                </Text>

              </GridItem>

              <GridItem>

                <Box borderRadius="24px" p={5} bg={useColorModeValue("linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)", "rgba(255,255,255,0.02)")} boxShadow={useColorModeValue("0 12px 28px rgba(15,23,42,0.06)", "0 10px 24px rgba(2,6,23,0.6)") }>

                  <HStack justify="center">

                    <Input size="sm" w="100px" defaultValue="0.5" textAlign="center" borderRadius="14px" bg={useColorModeValue("white","#071226")} border="none" />

                    <Text fontSize="12px" fontWeight="700">minutes</Text>

                  </HStack>

                </Box>

              </GridItem>

            </Grid>

          </Box>
        </Box>

      </VStack>
    </Box>
  );
};

export default GensetCommitmentStrategy;
