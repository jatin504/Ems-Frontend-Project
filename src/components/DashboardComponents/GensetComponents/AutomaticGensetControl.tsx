import { useState } from "react";
import {
  Box,
  Text,
  Switch,
  HStack,
  Input,
  Select,
  VStack,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";

const GlassCard = ({
  children,
  title,
  subtitle,
}: any) => {
  const cardBg = useColorModeValue("rgba(255,255,255,0.92)", "rgba(255,255,255,0.04)");
  const headerBg = useColorModeValue("linear-gradient(90deg, #0f172a, #1e293b)", "linear-gradient(90deg,#071226,#0b2236)");
  const headerText = useColorModeValue("white", "#dbeafe");
  const border = useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.06)");
  const shadow = useColorModeValue(
    `0 18px 40px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`,
    `0 12px 28px rgba(2,6,23,0.6)`
  );

  return (
    <Box
      borderRadius="28px"
      overflow="hidden"
      bg={cardBg}
      backdropFilter="blur(18px)"
      border={border}
      boxShadow={shadow}
    >
      <Box px={6} py={4} bg={headerBg}>
        <Text fontSize="13px" fontWeight="700" color={headerText} letterSpacing="0.4px">
          {title}
        </Text>

        {subtitle && (
          <Text fontSize="11px" color={useColorModeValue("rgba(31,41,55,0.7)", "rgba(203,213,225,0.6)")} mt={1}>
            {subtitle}
          </Text>
        )}
      </Box>

      <Box p={5}>{children}</Box>
    </Box>
  );
};

const ConfigRow = ({
  title,
  value,
  unit,
  description,
}: any) => {
  const bg = useColorModeValue("linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)", "rgba(255,255,255,0.02)");
  const border = useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)");

  return (
    <Box borderRadius="22px" p={5} bg={bg} border={border} boxShadow={useColorModeValue("0 12px 24px rgba(15,23,42,0.06)", "0 8px 20px rgba(2,6,23,0.6)")}
    >
      <HStack justify="space-between" align="flex-start">
        <Box maxW="70%">
          <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")}>{title}</Text>

          {description && (
            <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mt={2} lineHeight="20px">
              {description}
            </Text>
          )}
        </Box>

        <HStack>
          <Input size="sm" defaultValue={value} w="70px" textAlign="center" borderRadius="14px" bg={useColorModeValue("white", "#0b1220")} border="none" boxShadow={useColorModeValue(`0 6px 16px rgba(15,23,42,0.06)`, `0 6px 12px rgba(2,6,23,0.6)`)} />

          <Text fontSize="12px" fontWeight="600" color={useColorModeValue("#111827", "#cbd5e1")}>
            {unit}
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

const AutomaticGensetControl = () => {
  const [peakShaving, setPeakShaving] = useState(false);
  const [bessSoc, setBessSoc] = useState(false);
  const [powerAssist, setPowerAssist] = useState(false);

  const containerBg = useColorModeValue("linear-gradient(135deg, #edf2f7 0%, #dde7f2 100%)", "linear-gradient(135deg,#071226 0%,#041025 100%)");
  const containerBorder = useColorModeValue("1px solid rgba(255,255,255,0.75)", "1px solid rgba(255,255,255,0.04)");
  const containerShadow = useColorModeValue(`0 25px 55px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.95)`, `0 18px 40px rgba(2,6,23,0.6)`);

  return (
    <Box position="relative" overflow="hidden" borderRadius="34px" bg={containerBg} border={containerBorder} boxShadow={containerShadow} p={6}>

      {/* GLOW */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        w="280px"
        h="280px"
        borderRadius="full"
        bg="rgba(59,130,246,0.10)"
        filter="blur(80px)"
      />

      <Box
        position="absolute"
        bottom="-120px"
        left="-120px"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="rgba(0,255,200,0.10)"
        filter="blur(90px)"
      />

      <VStack
        spacing={6}
        align="stretch"
        position="relative"
        zIndex={2}
      >

        {/* TOP HEADER */}
        <Box
          borderRadius="30px"
          overflow="hidden"
          bg="linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0b1220 100%)"
          boxShadow={`
            0 18px 45px rgba(15,23,42,0.20)
          `}
        >

          <Box
            h="3px"
            bg="linear-gradient(90deg, #00d9b8, #3b82f6, #8b5cf6)"
          />

          <Box p={6}>

            <Text
              fontSize="18px"
              fontWeight="800"
              color="white"
              letterSpacing="0.5px"
            >
              Automatic Genset Start / Stop
            </Text>

            <Text
              fontSize="11px"
              color="rgba(255,255,255,0.72)"
              mt={1}
            >
              Intelligent EMS genset automation & BESS support coordination
            </Text>

            <HStack mt={5} spacing={4} flexWrap="wrap">

              <Box
                px={4}
                py={3}
                borderRadius="18px"
                bg="rgba(255,255,255,0.08)"
                border="1px solid rgba(255,255,255,0.08)"
              >
                <Text
                  fontSize="10px"
                  color="rgba(255,255,255,0.6)"
                >
                  Peak Shaving
                </Text>

                <Text
                  fontSize="12px"
                  fontWeight="800"
                  color="white"
                  mt={1}
                >
                  ACTIVE
                </Text>
              </Box>

              <Box
                px={4}
                py={3}
                borderRadius="18px"
                bg="rgba(255,255,255,0.08)"
                border="1px solid rgba(255,255,255,0.08)"
              >
                <Text
                  fontSize="10px"
                  color="rgba(255,255,255,0.6)"
                >
                  BESS Coordination
                </Text>

                <Text
                  fontSize="12px"
                  fontWeight="800"
                  color="white"
                  mt={1}
                >
                  ENABLED
                </Text>
              </Box>

              <Box
                px={4}
                py={3}
                borderRadius="18px"
                bg="rgba(255,255,255,0.08)"
                border="1px solid rgba(255,255,255,0.08)"
              >
                <Text
                  fontSize="10px"
                  color="rgba(255,255,255,0.6)"
                >
                  Automation
                </Text>

                <Text
                  fontSize="12px"
                  fontWeight="800"
                  color="#8fffd7"
                  mt={1}
                >
                  READY
                </Text>
              </Box>

            </HStack>

          </Box>
        </Box>

        {/*  PEAK SHAVING */}
        <GlassCard
          title="PEAK SHAVING AUTOMATION"
          subtitle="Automatic genset start/stop for demand peak management"
        >

          <HStack justify="space-between" mb={5}>
            <Box>
              <Text
                fontSize="13px"
                fontWeight="700"
                color="#172554"
              >
                Activate automatic genset start/stop for peak shaving
              </Text>

              <Text
                fontSize="11px"
                color="gray.600"
                mt={1}
              >
                EMS automatically manages genset operation during demand peaks
              </Text>
            </Box>

            <Switch
              size="lg"
              colorScheme="green"
              isChecked={peakShaving}
              onChange={(e) =>
                setPeakShaving(e.target.checked)
              }
            />
          </HStack>

          {peakShaving && (
            <Grid
              templateColumns={{
                base: "1fr",
                xl: "1fr 1fr 1fr",
              }}
              gap={5}
            >

              <GridItem>
                <ConfigRow
                  title="Margin Before Target"
                  value="10"
                  unit="kW"
                  description="Margin considered to activate the peak shaving before reaching the target limit or to deactivate after passing below it."
                />
              </GridItem>

              <GridItem>
                <ConfigRow
                  title="Start Delay"
                  value="1"
                  unit="minutes"
                  description="Gensets will start if power remains above target limit minus margin during this delay."
                />
              </GridItem>

              <GridItem>
                <ConfigRow
                  title="Stop Delay"
                  value="1"
                  unit="minutes"
                  description="Gensets will stop if power remains below target limit minus margin during this delay."
                />
              </GridItem>

            </Grid>
          )}

        </GlassCard>

        {/* BESS SOC */}
        <GlassCard
          title="BESS SOC AUTOMATION"
          subtitle="Automatic genset control based on battery SOC"
        >

          <HStack justify="space-between" mb={5}>
            <Box>
              <Text
                fontSize="13px"
                fontWeight="700"
                color="#172554"
              >
                Activate automatic genset start/stop based on BESS SoC
              </Text>

              <Text
                fontSize="11px"
                color="gray.600"
                mt={1}
              >
                Intelligent genset support during low battery conditions
              </Text>
            </Box>

            <Switch
              size="lg"
              colorScheme="green"
              isChecked={bessSoc}
              onChange={(e) =>
                setBessSoc(e.target.checked)
              }
            />
          </HStack>

          {bessSoc && (
            <Grid
              templateColumns={{
                base: "1fr",
                xl: "1fr 1fr",
              }}
              gap={5}
            >

              <GridItem>
                <ConfigRow
                  title="Start SoC"
                  value="10"
                  unit="%"
                  description="Gensets start charging when SOC falls below this threshold."
                />
              </GridItem>

              <GridItem>
                <ConfigRow
                  title="Stop SoC"
                  value="90"
                  unit="%"
                  description="Gensets stop after reaching this SOC level."
                />
              </GridItem>

              <GridItem colSpan={{ base: 1, xl: 2 }}>
                <Box
                  borderRadius="24px"
                  p={5}
                  bg="linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)"
                  boxShadow={`
                    0 12px 24px rgba(15,23,42,0.06)
                  `}
                >

                  <HStack justify="space-between">

                    <Box>
                      <Text
                        fontSize="12px"
                        fontWeight="700"
                        color="#172554"
                      >
                        Active Power Control Strategy
                      </Text>

                      <Text
                        fontSize="11px"
                        color="gray.600"
                        mt={2}
                      >
                        Cycle charging uses gensets to supply load and charge BESS simultaneously.
                      </Text>
                    </Box>

                    <Select
                      size="sm"
                      w="220px"
                      borderRadius="14px"
                      bg="white"
                    >
                      <option>Cycle charging</option>
                      <option>Load following</option>
                    </Select>

                  </HStack>

                </Box>
              </GridItem>

            </Grid>
          )}

        </GlassCard>

        {/*  POWER ASSIST */}
        <GlassCard
          title="BESS POWER ASSIST"
          subtitle="Automatic genset support during high BESS discharge demand"
        >

          <HStack justify="space-between" mb={5}>
            <Box>
              <Text
                fontSize="13px"
                fontWeight="700"
                color="#172554"
              >
                Activate automatic genset start/stop for BESS power assist
              </Text>

              <Text
                fontSize="11px"
                color="gray.600"
                mt={1}
              >
                Gensets assist BESS during high power demand
              </Text>
            </Box>

            <Switch
              size="lg"
              colorScheme="green"
              isChecked={powerAssist}
              onChange={(e) =>
                setPowerAssist(e.target.checked)
              }
            />
          </HStack>

          {powerAssist && (
            <Grid
              templateColumns={{
                base: "1fr",
                xl: "1fr 1fr",
              }}
              gap={5}
            >

              <GridItem>
                <ConfigRow
                  title="BESS Power Reserve"
                  value="10"
                  unit="kW"
                  description="Minimum discharge reserve maintained by BESS."
                />
              </GridItem>

              <GridItem>
                <ConfigRow
                  title="Margin For BESS Power Assist"
                  value="1"
                  unit="kW"
                  description="Defines threshold to start/stop gensets"
                />
              </GridItem>

              <GridItem>
                <ConfigRow
                  title="Start Delay"
                  value="5"
                  unit="seconds"
                  description="Time BESS power must stay above threshold before starting genset."
                />
              </GridItem>

              <GridItem>
                <ConfigRow
                  title="Stop Delay"
                  value="5"
                  unit="seconds"
                  description="Time BESS power must stay below threshold before stopping genset."
                />
              </GridItem>

            </Grid>
          )}

        </GlassCard>

      </VStack>
    </Box>
  );
};

export default AutomaticGensetControl;