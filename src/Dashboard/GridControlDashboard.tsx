import {
  Box,
  Text,
  Switch,
  VStack,
  HStack,
  Button,
  Input,
  Select,
  Divider,
  Grid,
  GridItem,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import PeakShavingBESS from "../components/DashboardComponents/GridComponent/PeakShavingBESS";
import ReactivePowerControl from "../components/DashboardComponents/GridComponent/ReactivePowerControl";

/* ----------- MAIN ----------- */
export default function GridControlDashboard() {
  const [exportControl, setExportControl] = useState(false);
  const containerBg = useColorModeValue("#edf2f7", "linear-gradient(135deg,#071226 0%,#041025 100%)");
  const containerBorder = useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)");
  const panelBg = useColorModeValue("rgba(255,255,255,0.78)", "rgba(255,255,255,0.03)");
  const panelBorder = useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)");
  const panelShadow = useColorModeValue(`0 18px 40px rgba(15,23,42,0.08)`, `0 12px 28px rgba(2,6,23,0.6)`);

  return (
    <Box
      w="100%"
      position="relative"
      overflow="hidden"
      borderRadius="34px"
      p={6}
      bg={containerBg}
      border={containerBorder}
      boxShadow={`0 25px 60px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.95)`}
    >
      {/* BACKGROUND GLOW */}
      <Box
        position="absolute"
        top="-120px"
        right="-120px"
        w="320px"
        h="320px"
        borderRadius="full"
        bg="rgba(0,198,167,0.10)"
        filter="blur(90px)"
      />

      <Box
        position="absolute"
        bottom="-120px"
        left="-120px"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="rgba(59,130,246,0.10)"
        filter="blur(90px)"
      />

      <VStack spacing={6} align="stretch" position="relative" zIndex={2}>
        
        {/*  TOP HEADER */}
        <Box
          borderRadius="28px"
          overflow="hidden"
          bg="linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0b1220 100%)"
          boxShadow={`
            0 18px 45px rgba(15,23,42,0.20)
          `}
        >
          {/* TOP GLOW BAR */}
          <Box
            h="3px"
            bg="linear-gradient(90deg, #00d9b8, #3b82f6, #8b5cf6)"
          />

          <Grid
            templateColumns={{
              base: "1fr",
              lg: "1.3fr 0.7fr",
            }}
            gap={6}
            p={6}
            alignItems="center"
          >
            {/* LEFT */}
            <GridItem>
                <Text fontSize="18px" fontWeight="800" color={useColorModeValue("#0f172a", "white")} letterSpacing="0.4px">
                  Grid Power Management
                </Text>

              <Text fontSize="11px" color={useColorModeValue("gray.600", "rgba(255,255,255,0.72)")} mt={1}>
                Advanced EMS export & reactive power optimization panel
              </Text>

              {/* STATUS CHIPS */}
              <HStack mt={4} spacing={3} flexWrap="wrap">
                <Badge
                  px={3}
                  py={1}
                  borderRadius="12px"
                  bg="rgba(255,255,255,0.08)"
                  color="white"
                  fontSize="10px"
                  fontWeight="700"
                >
                  PCC ONLINE
                </Badge>

                <Badge
                  px={3}
                  py={1}
                  borderRadius="12px"
                  bg="rgba(0,255,170,0.12)"
                  color="#9fffd7"
                  fontSize="10px"
                  fontWeight="700"
                >
                  EXPORT CONTROL ACTIVE
                </Badge>

                <Badge
                  px={3}
                  py={1}
                  borderRadius="12px"
                  bg="rgba(255,184,0,0.12)"
                  color="#ffe08a"
                  fontSize="10px"
                  fontWeight="700"
                >
                  REACTIVE MODE READY
                </Badge>
              </HStack>
            </GridItem>

            {/* RIGHT */}
            <GridItem>
              <Grid
                templateColumns="repeat(3,1fr)"
                gap={3}
              >
                <Box p={3} borderRadius="18px" bg={useColorModeValue("rgba(0,0,0,0.02)", "rgba(255,255,255,0.04)")} border={useColorModeValue("1px solid rgba(255,255,255,0.04)", "1px solid rgba(255,255,255,0.04)")} backdropFilter="blur(14px)">
                  <Text fontSize="10px" color={useColorModeValue("gray.500", "rgba(255,255,255,0.6)")}>PCC</Text>

                  <Text fontSize="12px" fontWeight="800" color={useColorModeValue("#243447", "white")} mt={1}>BESS-1</Text>
                </Box>

                <Box p={3} borderRadius="18px" bg={useColorModeValue("rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)")} border={useColorModeValue("1px solid rgba(255,255,255,0.08)", "1px solid rgba(255,255,255,0.04)")} backdropFilter="blur(14px)">
                  <Text fontSize="10px" color={useColorModeValue("gray.500", "rgba(255,255,255,0.6)")}>Export Limit</Text>

                  <Text fontSize="12px" fontWeight="800" color={useColorModeValue("white", "white")} mt={1}>-50 kW</Text>
                </Box>

                <Box p={3} borderRadius="18px" bg={useColorModeValue("rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)")} border={useColorModeValue("1px solid rgba(255,255,255,0.08)", "1px solid rgba(255,255,255,0.04)")} backdropFilter="blur(14px)">
                  <Text fontSize="10px" color={useColorModeValue("gray.500", "rgba(255,255,255,0.6)")}>Reactive Cap</Text>

                  <Text fontSize="12px" fontWeight="800" color={useColorModeValue("white", "white")} mt={1}>±200 kVAr</Text>
                </Box>
              </Grid>
            </GridItem>
          </Grid>
        </Box>

        {/* 🔹 ACTIVE POWER EXPORT */}
        <Box borderRadius="30px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={panelBorder} boxShadow={panelShadow}>
          {/* HEADER */}
          <Box px={6} py={5} borderBottom={`1px solid ${useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)")}`} bg={useColorModeValue("linear-gradient(90deg, rgba(255,255,255,0.65), rgba(240,245,250,0.55))", "linear-gradient(90deg, rgba(12,20,34,0.6), rgba(6,10,18,0.6))") }>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="16px" fontWeight="700" color={useColorModeValue("#0f172a", "#e6eefb")}>Active Power Export Control</Text>

                <Text fontSize="12px" color={useColorModeValue("gray.600", "gray.300")} mt={1}>Dynamic PCC import/export optimization</Text>
              </Box>

              <Switch
                size="lg"
                colorScheme="green"
                isChecked={exportControl}
                onChange={(e) =>
                  setExportControl(e.target.checked)
                }
              />
            </HStack>
          </Box>

          {/* CONTENT */}
          {exportControl && (
            <Grid
              templateColumns={{
                base: "1fr",
                xl: "1fr 1fr",
              }}
              gap={5}
              p={6}
            >
              {/* CARD 1 */}
              <GridItem>
                <Box h="100%" borderRadius="24px" p={5} bg={useColorModeValue("linear-gradient(135deg, #ffffff, #f1f5f9)", "rgba(255,255,255,0.02)")} border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 12px 28px rgba(15,23,42,0.06)", "0 10px 24px rgba(2,6,23,0.6)") }>
                  <Text fontSize="14px" fontWeight="700" color={useColorModeValue("#243447", "#cbd5e1")}>Minimum Active Power Import at PCC</Text>

                  <Text fontSize="12px" color={useColorModeValue("gray.600", "gray.300")} mt={2} mb={5}>Positive value sets minimum import at PCC, negative value sets maximum export limit.</Text>

                  <HStack justify="space-between" align="center" p={4} borderRadius="18px" bg={useColorModeValue("#f8fafc", "#071226")}>
                    <Text fontSize="12px" color={useColorModeValue("gray.700", "gray.300")}>Import / Export Value</Text>

                    <HStack>
                      <Input size="sm" w="90px" textAlign="center" defaultValue="-10" border="none" bg={useColorModeValue("white", "#071226")} borderRadius="14px" fontWeight="700" />

                      <Text fontSize="13px" fontWeight="700" color={useColorModeValue("#243447", "#cbd5e1")}>kW</Text>
                    </HStack>
                  </HStack>
                </Box>
              </GridItem>

              {/* CARD 2 */}
              <GridItem>
                <Box h="100%" borderRadius="24px" p={5} bg={useColorModeValue("linear-gradient(135deg, #ffffff, #f1f5f9)", "rgba(255,255,255,0.02)")} border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 12px 28px rgba(15,23,42,0.06)", "0 10px 24px rgba(2,6,23,0.6)") }>
                  <Text fontSize="14px" fontWeight="700" color={useColorModeValue("#243447", "#cbd5e1")}>
                    Grid Meter Sensing Method
                  </Text>

                  <Text fontSize="12px" color={useColorModeValue("gray.600", "gray.300")} mt={2} mb={5}>
                    Select the algorithm used to aggregate phase-wise measurements for export control.
                  </Text>

                  <HStack justify="space-between" align="center" p={4} borderRadius="18px" bg={useColorModeValue("#f8fafc", "#071226")}>
                    <Text fontSize="12px" color={useColorModeValue("gray.700", "gray.300")}>
                      Meter Aggregation Logic
                    </Text>

                    <Select size="sm" w="220px" bg={useColorModeValue("white", "#071226")} border="none" borderRadius="14px" fontWeight="600">
                      <option>Sum of all phases</option>
                      <option>3x lowest phase</option>
                    </Select>
                  </HStack>
                </Box>
              </GridItem>
            </Grid>
          )}
        </Box>

        {/* 🔹 PEAK SHAVING */}
        <Box borderRadius="30px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={panelBorder} boxShadow={panelShadow} p={4}>
          <PeakShavingBESS />
        </Box>

        {/* 🔹 REACTIVE POWER */}
        <Box borderRadius="30px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={panelBorder} boxShadow={panelShadow} p={4}>
          <ReactivePowerControl />
        </Box>

        <Divider
          borderColor="rgba(255,255,255,0.7)"
        />

        {/* 🔹 SAVE BUTTON */}
        <Button
          h="60px"
          borderRadius="24px"
          position="relative"
          overflow="hidden"
          bg="linear-gradient(135deg, #ffd84d 0%, #f2b600 50%, #ffb300 100%)"
          color="#1f2937"
          fontSize="17px"
          fontWeight="800"
          letterSpacing="0.5px"
          boxShadow={`
            0 20px 40px rgba(242,182,0,0.30)
          `}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: "-120%",
            width: "70%",
            height: "100%",
            bg: "rgba(255,255,255,0.35)",
            transform: "skewX(-20deg)",
            transition: "0.7s",
          }}
          _hover={{
            transform: "translateY(-2px)",
          }}
          sx={{
            "&:hover::before": {
              left: "140%",
            },
          }}
        >
          SAVE CONFIGURATION
        </Button>
      </VStack>
    </Box>
  );
}