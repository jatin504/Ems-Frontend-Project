import { Box, Text, Flex, Progress } from '@chakra-ui/react'
import { useMemo } from 'react';
import { useLatestESSData } from '../hooks/ess/useLatestESSData';

const BatteryHealthCard = () => {
  const keys = useMemo(() => ['voltage', 'temperature', 'frequency_hz'], []); // you can change this dynamically
    const { data, status, error } = useLatestESSData(keys);
  
    if (status === 'error') return <div>Error: {error}</div>;
  
    // console.log(data)
  
    const sumVoltage = data ? data.reduce((sum, item) => sum + parseFloat(item.voltage), 0) : 0;
    const sumTemperature = data ? data.reduce((sum, item) => sum + parseFloat(item.temperature), 0) : 0;
    const sumFrequency = data ? data.reduce((sum, item) => sum + parseFloat(item.frequency), 0) : 0;
  
    // Calculate the average
    const avgVoltage = data ? sumVoltage / data.length : 1;
    const avgTemperature = data ? sumTemperature / data.length : 1;
    const avgFrequency = data ? sumFrequency / data.length : 1;
  return (
    <Box p={4} bg="gray.900" borderRadius="xl" shadow="md" color="white" h="200px">
      <Text mb={3} fontWeight="bold" color="gray.400">
        Battery Health
      </Text>

      <Flex direction="column" gap={4}>
        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color="#fff" minW="90px">Voltage</Text>
          <Progress
            value={avgVoltage/400 * 100}
            size="sm"
            sx={{
              '& > div': {
                backgroundColor: 'blue.300',
              },
            }}
            bg="gray.600"
            flex="1"
            ml={4}
          />
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color="#fff" minW="90px">Temperature</Text>
          <Progress
            value={avgTemperature}
            size="sm"
            sx={{
              '& > div': {
                backgroundColor: 'orange.300',
              },
            }}
            bg="gray.600"
            flex="1"
            ml={4}
          />
        </Flex>

        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color="white" minW="90px">Frequency</Text>
          <Progress
            value={avgFrequency}
            size="sm"
            colorScheme='cyan'
            bg="gray.600"
            flex="1"
            ml={4}
            sx={{
              '& > div': {
                backgroundColor: 'yellow.300',
              },
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
}

export default BatteryHealthCard
