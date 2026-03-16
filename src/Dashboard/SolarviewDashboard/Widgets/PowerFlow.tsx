import { Box, Text, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import PowerFlowSVG from '../../../../assets/PlantView/PowerFlowSVG';
import { useLatestData } from '../../../../hooks/universal_latest_values/useLatestData';
import { useMemo } from 'react';

const PowerFlow = () => {


  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");

  // Map real Values when Plant get onlines
    const keys = useMemo(
      () => ['voltage', 'power_kw', 'frequency_hz', 'amps', 'daily_energy_kwh'],
      []
    );
    const { data, status, error } = useLatestData("_plant_device_", keys);
  
    const sumVoltage = data ? data.reduce((sum, item) => sum + parseFloat(item.voltage), 0) : 0;
    const sumPower = data ? data.reduce((sum, item) => sum + parseFloat(item.power_kw), 0) : 0;
    const sumFrequency = data ? data.reduce((sum, item) => sum + parseFloat(item.frequency_hz), 0) : 0;
    const sumAmps = data ? data.reduce((sum, item) => sum + parseFloat(item.amps), 0) : 0;
    const sumEnergy = data ? data.reduce((sum, item) => sum + parseFloat(item.daily_energy_kwh), 0) : 0;


  return (
    <Box
      width={"330px"}
      height={"100%"}
      p={"16px"}
      rounded={"12px"}
      bg={primaryBg}
      fontSize={"14px"}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      color={primaryColor}
    >
      <VStack
        spacing={"5px"}
        width={"100%"}
        height={"100%"}
      >
        {/* Title */}
        <Text fontSize="16px" fontWeight="600" mb={4} width={"100%"} textAlign={"left"}>
          Plant
        </Text>
        <Box
          width={"100%"}
          height={"100%"}
        >
          <PowerFlowSVG 
            solar={987}
            grid={97}
            battery={98}
          />
        </Box>
      </VStack>

      
    </Box>
  );
};

export default PowerFlow;
