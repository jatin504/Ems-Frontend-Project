import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useLatestPOIData } from '../hooks/poi_meter/useLatestPOIData';

const MeterCard = () => {
  const keys = useMemo(
    () => ['voltage', 'power_kw', 'frequency_hz', 'amps', 'daily_energy_kwh'],
    []
  );
  const { data, status, error } = useLatestPOIData(keys);

  if (status === 'error') return <div>Error: {error}</div>;

  const sumVoltage = data ? data.reduce((sum, item) => sum + parseFloat(item.voltage), 0) : 0;
  const sumPower = data ? data.reduce((sum, item) => sum + parseFloat(item.power_kw), 0) : 0;
  const sumFrequency = data ? data.reduce((sum, item) => sum + parseFloat(item.frequency_hz), 0) : 0;
  const sumAmps = data ? data.reduce((sum, item) => sum + parseFloat(item.amps), 0) : 0;
  const sumEnergy = data ? data.reduce((sum, item) => sum + parseFloat(item.daily_energy_kwh), 0) : 0;

  const avgVoltage = data ? sumVoltage / data.length : 1;
  const avgPower = data ? sumPower / data.length : 1;
  const avgFrequency = data ? sumFrequency / data.length : 1;
  const avgAmps = data ? sumAmps / data.length : 1;

  return (
    <Box
      ml="-10"
      bg="gray.900"
      borderRadius="lg"
      p={4}
      color="white"
      w="330px"   // fixed width
      h="350px"   // fixed height
      boxShadow="md"
      display="flex"
      flexDirection="column"
      justifyContent="space-between" // 🔑 evenly distribute
    >
      {/* Title */}
      <Text fontSize="md" fontWeight="bold">
        Meter
      </Text>

      {/* Readings - evenly spaced */}
      <VStack align="stretch" spacing={4} fontSize="sm" flex="1" justify="center">
        <HStack justify="space-between">
          <Text color="gray.400">Instant Power:</Text>
          <Text fontWeight="semibold">{avgPower.toFixed(2)} kW</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="gray.400">Daily Energy:</Text>
          <Text fontWeight="semibold">{sumEnergy.toFixed(2)} kWh</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="gray.400">Frequency:</Text>
          <Text fontWeight="semibold">{avgFrequency.toFixed(2)} Hz</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="gray.400">Voltage:</Text>
          <Text fontWeight="semibold">{avgVoltage.toFixed(2)} kV</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="gray.400">Current:</Text>
          <Text fontWeight="semibold">{avgAmps.toFixed(2)} A</Text>
        </HStack>
      </VStack>

      {/* Warnings & Alarms - always bottom aligned */}
      <HStack justify="space-around" pt={3}>
        <VStack spacing={0} textAlign="center">
          <AlertTriangle color="yellow" size={20} />
          <Text fontSize="xs">12 WARNINGS</Text>
          <Text fontSize="10px" color="gray.500">ACTIVE</Text>
        </VStack>
        <VStack spacing={0} textAlign="center">
          <AlertCircle color="red" size={20} />
          <Text fontSize="xs">7 ALARMS</Text>
          <Text fontSize="10px" color="gray.500">ACTIVE</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default MeterCard;
