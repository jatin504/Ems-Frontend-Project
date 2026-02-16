import {
  Box,
  Text,
  Badge,
  Flex,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useLatestPCSData } from "../hooks/pcs/useLatestPCSData";
import { useMemo } from "react";
import { useLatestPOIData } from "../hooks/poi_meter/useLatestPOIData";
import { useLatestPcsController1Data } from "../hooks/pcs_controller/useLatestPcsController1Data";

export default function BessWidgets() { 

  const keys = useMemo(() => ['soc', 'soh', 'charge_energy_kwh', 'voltage', 'amps'], []);
const { data: PCSData, status: PCSStatus, error: PCSError } = useLatestPCSData(keys);

if (PCSStatus === 'error') return <div>Error: {PCSError}</div>;

const sumSoC = PCSData ? PCSData.reduce((sum, item) => sum + parseFloat(item.soc), 0) : 0;
const sumSoH = PCSData ? PCSData.reduce((sum, item) => sum + parseFloat(item.soh), 0) : 0;
const sumChargeEnergyKwh = PCSData ? PCSData.reduce((sum, item) => sum + parseFloat(item.charge_energy_kwh), 0) : 0;
const sumVolt = PCSData ? PCSData.reduce((sum, item) => sum + parseFloat(item.voltage), 0) : 0;
const sumAmps = PCSData ? PCSData.reduce((sum, item) => sum + parseFloat(item.amps), 0) : 0;

const avgSoc = PCSData ? sumSoC / PCSData.length : 1;
const avgSoh = PCSData ? sumSoH / PCSData.length : 1;
const avgChargeEnergyKwh = PCSData ? sumChargeEnergyKwh / PCSData.length : 1;
const avgVolt = PCSData ? sumVolt / PCSData.length : 1;
const avgAmps = PCSData ? sumAmps / PCSData.length : 1;

const keysPOI = useMemo(() => ['power_kw', 'voltage', 'frequency_hz', 'amps'], []);
const { data: POIData, status: POIStatus, error: POIError } = useLatestPOIData(keysPOI);

if (POIStatus === 'error') return <div>Error: {POIError}</div>;

const sumPowerPOI = POIData ? POIData.reduce((sum, item) => sum + parseFloat(item.power_kw), 0) : 0;
const sumVoltPOI = POIData ? POIData.reduce((sum, item) => sum + parseFloat(item.voltage), 0) : 0;
const sumFreqPOI = POIData ? POIData.reduce((sum, item) => sum + parseFloat(item.frequency_hz), 0) : 0;
const sumAmpsPOI = POIData ? POIData.reduce((sum, item) => sum + parseFloat(item.amps), 0) : 0;

const avgPOIPower = POIData ? sumPowerPOI / POIData.length : 1;
const avgPOIVolt = POIData ? sumVoltPOI / POIData.length : 1;
const avgPOIFreq = POIData ? sumFreqPOI / POIData.length : 1;
const avgPOIAmps = POIData ? sumAmpsPOI / POIData.length : 1;

const keyController = useMemo(() => ['chargeah'], []);
const { data: ControllerData, status: ControllerStatus, error: ControllerError } = useLatestPcsController1Data(keyController);

const sumChargeEnergy = ControllerData ? ControllerData.reduce((sum, item) => sum + parseFloat(item.chargeah), 0) : 0;
const avgChargeEnergy = ControllerData ? sumChargeEnergy / ControllerData.length : 1;



  return (
    <Box
      bg="gray.800"
      p={4}
      borderRadius="md"
      boxShadow="md"
      width="100%"
      height="100%"
    >
      <Flex gap={4} height="100%">
        <VStack spacing={4} align="stretch" width="50%">
          <Box bg="gray.900" p={4} borderRadius="md" height="190px">
            <Text fontSize="sm" color="gray.400" mb={1}>State of Charge</Text>
            <Flex align="center" justify="center" mt={4}>
              <CircularProgress value={avgSoc} size="90px" trackColor='gray.600' thickness="10px" color="blue.400">
                <CircularProgressLabel>
                  <Text fontWeight="bold" fontSize="lg">{avgSoc}%</Text>
                </CircularProgressLabel>
              </CircularProgress>
            </Flex>
            {/* <Text fontSize="md" fontWeight="bold" mt={3} textAlign="center">0 kW</Text> */}
          </Box>

          <Box bg="gray.900" p={2} borderRadius="md" height="130px">
            <HStack>
              <Box>
                <Text fontSize="sm" color="gray.400" mb={1}>Voltage</Text>
                <Text fontSize="2xl" fontWeight="bold">{avgVolt} <small style={{ fontSize: "14px" }}>V</small></Text>
                {/* <Text fontSize="xs" color="gray.500">A A</Text> */}
                <Box mt={1}>
                  <svg width="100%" height="30">
                    <polyline fill="none" stroke="#4FD1C5" strokeWidth="2"
                      points="0,20 10,15 20,18 30,14 40,17 50,13 60,16 70,12 80,15 90,11 100,14"
                    />
                  </svg>
                </Box>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.400" mb={1}>Current</Text>
                <HStack spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold">{avgAmps} <small style={{ fontSize: "14px" }}>A</small></Text>
                  {/* <Badge colorScheme="green" variant="solid" fontSize="xs">ON</Badge> */}
                </HStack>
                <Box mt={1}>
                  <svg width="100%" height="30">
                    <polyline fill="none" stroke="#63B3ED" strokeWidth="2"
                      points="0,20 10,19 20,17 30,20 40,16 50,18 60,15 70,17 80,14 90,16 100,13"
                    />
                  </svg>
                </Box>
              </Box>
            </HStack>
          </Box>
        </VStack>

        <VStack spacing={4} align="stretch" width="50%">
          <Box bg="gray.900" p={2} borderRadius="md" height="70px">
            <Text fontSize="sm" color="gray.400" mb={1}>State of Health</Text>
            <Text fontSize="2xl" fontWeight="bold">{avgSoh}%</Text>
          </Box>

          <Box bg="gray.900" p={2} borderRadius="md" height="90px">
            <Text fontSize="sm" color="gray.400" mb={1}>Charge/Discharge Power</Text>
            <Text fontSize="xl" fontWeight="bold">{avgChargeEnergy} kW</Text>
          </Box>

          <Box bg="gray.900" p={4} borderRadius="md" flex="1">
            <Text fontSize="sm" color="gray.400" mb={1}>POI Meter</Text>
            <HStack width={"100%"} justify={"space-between"}>
              <HStack spacing={2}>
                <Text fontSize={"sm"}>Power :</Text>
                <Text fontSize="sm" fontWeight="bold">{avgPOIPower} kW</Text>
              </HStack>
              <HStack spacing={2}>
                <Text fontSize={"sm"}>Voltage :</Text>
                <Text fontSize="sm" fontWeight="bold">{avgPOIVolt} V</Text>
              </HStack>
            </HStack>
            <HStack width={"100%"} justify={"space-between"}>
              <HStack spacing={2}>
                <Text fontSize={"sm"}>Frequency :</Text>
                <Text fontSize="sm" fontWeight="bold">{avgPOIFreq} Hz</Text>
              </HStack>
              <HStack spacing={2}>
                <Text fontSize={"sm"}>Current :</Text>
                <Text fontSize="sm" fontWeight="bold">{avgPOIAmps} A</Text>
              </HStack>
            </HStack>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}
