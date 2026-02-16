import { Box, Text, VStack } from '@chakra-ui/react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/progress'
import { useLatestESSData } from '../hooks/ess/useLatestESSData';
import { useMemo } from 'react';

const BatteryStatusCard = () => {
  const keys = useMemo(() => ['soc'], []); // you can change this dynamically
  const { data, status, error } = useLatestESSData(keys);

  if (status === 'error') return <div>Error: {error}</div>;

  // console.log(data)

  const sumSoC = data ? data.reduce((sum, item) => sum + parseFloat(item.soc), 0) : 0;

  // Calculate the average
  const avgSoc = data ? sumSoC / data.length : 1;

  return (
    <Box
      p={4}
      w="380px"
      h="250px"
      bg="gray.900"
      borderRadius="xl"
      shadow="md"
      textAlign="center"
      color="white"
    >
      <VStack spacing={3}>
        <Text fontSize="md" color="gray.200">
          Battery State of Charge
        </Text>
        <CircularProgress value={avgSoc} size="180px" color="green.400" trackColor='gray.600' thickness="12px">
          <CircularProgressLabel fontSize="2xl" color="white.300">
            {avgSoc} %
          </CircularProgressLabel>
        </CircularProgress>
      </VStack>
    </Box>
  )
}
export default BatteryStatusCard
