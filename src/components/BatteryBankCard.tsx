import {
  Box,
  Text,
  Flex,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Maximize2 } from 'lucide-react'; 

interface BatteryBankCardProps {
  title: string;
  connected: number;
  disabled: number;
  voltage: number;
  current: number;
  tempLow: number;
  tempHigh: number;
}

const BatteryBankCard = ({
  title,
  connected = 0,
  disabled = 0,
  voltage = 0,
  current = 0,
  tempLow = 0,
  tempHigh = 0,
}: BatteryBankCardProps) => {
  const total = connected + disabled;
  const percentage = total ? (connected / total) * 100 : 0;
  const navigate = useNavigate();

  const handleFullScreenClick = () => {
      navigate('/batterybank', {state : {currentBank : title}});
  };

  return (
    <Box
      bg="gray.900"
      borderRadius="md"
      p={3}
      color="white"
      w="100%"
      maxW="670px"
      boxShadow="md"
      position="relative"
      _hover={{
        boxShadow: 'lg',
        transform: 'scale(1.01)',
        transition: '0.2s',
      }}
    >
      <IconButton
        icon={<Maximize2 size={16} />}
        size="sm"
        aria-label="fullscreen"
        position="absolute"
        top="8px"
        right="8px"
        onClick={handleFullScreenClick}
        variant="ghost"
        color="whiteAlpha.800"
        zIndex={10}
      />

      {/* Title */}
      <Text fontSize="sm" fontWeight="semibold" mb={2} textTransform={"uppercase"}>
        {title.replace(/_/g, " ")}
      </Text>

      <Flex align="center" justify="flex-start" w="100%" flexWrap="wrap">
        <HStack spacing={16} align="flex-start" w="100%">
          {/* LEFT: Circular + Status */}
          <HStack spacing={8}>
            <CircularProgress
              value={percentage}
              size="120px"
              thickness="12px"
              color="teal.400"
              trackColor="gray.600"
            >
              <CircularProgressLabel fontSize="md" fontWeight="bold">
                {connected}
              </CircularProgressLabel>
            </CircularProgress>

            <VStack align="start" spacing={3}>
              {/* Connected */}
              <HStack spacing={2}>
                <Box width="4px" height="38px" bg="teal.400" borderRadius="md" />
                <VStack spacing={0} align="start">
                  <Text fontSize="xs" color="gray.300">CONNECTED</Text>
                  <Text fontWeight="bold" fontSize="sm">{connected}</Text>
                </VStack>
              </HStack>

              {/* Disabled */}
              <HStack spacing={2}>
                <Box width="4px" height="38px" bg="gray.500" borderRadius="md" />
                <VStack spacing={0} align="start">
                  <Text fontSize="xs" color="gray.500">DISABLED</Text>
                  <Text fontWeight="bold" fontSize="sm">{disabled}</Text>
                </VStack>
              </HStack>
            </VStack>
          </HStack>

          {/* RIGHT: Strings & Module Temps */}
          <VStack align="start" spacing={4}>
            {/* Strings */}
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.300">Strings</Text>
              <HStack spacing={8}>
                <Text fontWeight="bold" fontSize="lg">
                  {voltage.toFixed(2)} V
                </Text>
                <Box ml="10px">
                  <Text fontWeight="bold" fontSize="lg">
                    {current.toFixed(2)} A
                  </Text>
                </Box>
              </HStack>
            </VStack>

            {/* Module Temps */}
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.300">Module Temps</Text>
              <HStack spacing={10}>
                <Text fontSize="md" fontWeight="semibold" color="blue.300">
                  {tempLow.toFixed(2)} °C
                </Text>
                <Box ml="26px">
                  <Text fontSize="md" fontWeight="semibold" color="orange.300">
                    {tempHigh.toFixed(2)} °C
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </VStack>
        </HStack>
      </Flex>
    </Box>
  );
};

export default BatteryBankCard;
