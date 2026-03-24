import { Box, Text, useColorModeValue, HStack, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

const DEVICE_ID = "plant_1_pcs_2_bank_bank_1";

const CarbonEmissions = () => {

  const labelColor = useColorModeValue("gray.300", "whiteAlpha.700");
  const valueColor = "white";
  const insightBg = "rgba(255,255,255,0.06)";

  const [vals,setVals] = useState({
    co2:0,
    oil:0,
    trees:0,
    cars:0
  });

  const getVal = (deviceObj:any,key:string) => {

    const realKey = Object.keys(deviceObj)
      .find(k => k.trim() === key);

    if(!realKey) return 0;

    return Number(deviceObj[realKey]?.value ?? 0);
  };

  useEffect(()=>{

    let mounted = true;

    const load = async ()=>{

      try{

        const res = await fetch(
          `${API_BASE}/api/lastest-direct-data/multiple-latest-devices`,
          {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({
              device_ids: DEVICE_ID
            })
          }
        );

        const j = await res.json();

        if(!mounted) return;
        if(!j.success) return;

        const d = j.data?.[DEVICE_ID];
        if(!d) return;

        setVals({
          co2: getVal(d,"Phase_A_voltage"),
          oil: getVal(d,"Fan_speed_12"),
          trees: getVal(d,"Total_energy_charged"),
          cars: getVal(d,"Total_energy_discharged")
        });

      }catch(e){
        console.error(e);
      }

    };

    load();

    const i = setInterval(load,60000);

    return ()=>{
      mounted = false;
      clearInterval(i);
    };

  },[]);

  return (
    <Flex
      direction="column"
      bg="rgba(0,0,0,0.45)"
      borderRadius="lg"
      p={3}
      shadow="xl"
      backdropFilter="blur(8px)"
      border="1px solid rgba(255,255,255,0.12)"
      width="240px"
      height="180px"
    >

      <Text fontSize="sm" fontWeight="bold" color="white" mb={1}>
        Environmental Saving
      </Text>

      <Box mb={1}>
        <HStack justify="space-between">
          <Text fontSize="xs" color={labelColor}>CO2 saved</Text>
          <Text fontSize="xs" fontWeight="bold" color="green.400">
            {vals.co2}
          </Text>
        </HStack>

        <Box mt={1} h="4px" bg="rgba(255,255,255,0.12)" borderRadius="full">
          <Box w={`${Math.min(vals.co2,1000)/10}%`} h="100%" bg="green.400" borderRadius="full" />
        </Box>
      </Box>

      <Box mb={1}>
        <HStack justify="space-between">
          <Text fontSize="xs" color={labelColor}>Oil saved</Text>
          <Text fontSize="xs" fontWeight="bold" color="#F59E0B">
            {vals.oil}
          </Text>
        </HStack>

        <Box mt={1} h="4px" bg="rgba(255,255,255,0.12)" borderRadius="full">
          <Box w={`${Math.min(vals.oil,1000)/10}%`} h="100%" bg="#F59E0B" borderRadius="full" />
        </Box>
      </Box>

      <HStack justify="space-between" mb={0.5}>
        <Text fontSize="xs" color={labelColor}>Trees equivalent</Text>
        <Text fontSize="xs" fontWeight="bold" color={valueColor}>
          {vals.trees}
        </Text>
      </HStack>

      <HStack justify="space-between">
        <Text fontSize="xs" color={labelColor}>Cars offset</Text>
        <Text fontSize="xs" fontWeight="bold" color={valueColor}>
          {vals.cars}
        </Text>
      </HStack>

      <Box mt="auto" bg={insightBg} p={1.5} borderRadius="md">
        <Text fontSize="10px" color={labelColor} fontWeight="bold">
          INSIGHTS
        </Text>

        <Text fontSize="xs" color="white" fontWeight="semibold">
          Powering {vals.cars} homes
        </Text>
      </Box>

    </Flex>
  );
};

export default CarbonEmissions;