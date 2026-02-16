import React, { useEffect, useMemo } from "react";
import { Box, Flex, Text, Badge, HStack, useColorModeValue } from "@chakra-ui/react";
import useDSM from "../../../../hooks/DSM/useDSM";

const TariffCard: React.FC = () => {

  const {FetchTariffByStateCode, tariffData} = useDSM();
  
  const state_code = useMemo(() => "MH", []);
  useEffect(() => {
    FetchTariffByStateCode(state_code);
  }, [state_code]);

  const bg = useColorModeValue("rgba(255,255,255,1)", "rgba(22,27,27,1)");
  return (
    <Box
      bg={bg}
      borderRadius="12px"
      px={4}
      py={4}
      w="370px"
      h="285px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      opacity={1}
      style={{ transform: "rotate(0deg)" }}
    >
      {/* Header */}
      <Text fontSize="16px" fontWeight={600} color={useColorModeValue("#111718", "whiteAlpha.800")}> 
        Tariff Maharashtra
      </Text>

      {/* Value + unit side-by-side (baseline aligned) */}
      <Flex align="center" justify="center" flexGrow={1}>
        <HStack align="baseline" spacing="10px">
          <Text fontSize="96px" fontWeight="bold" color={useColorModeValue("#111718", "white")}> 
            {tariffData? tariffData.tariff : 0}
          </Text>
          <Text fontSize="20px" color={useColorModeValue("#3A4A5A", "#cfe0ff")}> 
            ₹/kWh
          </Text>
        </HStack>
      </Flex>

      {/* Bottom badges */}
      <Flex justify="space-between" mt={2}>
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          bg={useColorModeValue("#F5F7FA", "#1c1f24")}
          color={useColorModeValue("#111718", "whiteAlpha.900")}
          fontSize="12px"
        >
          Peak tariff
        </Badge>
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          bg={useColorModeValue("#F5F7FA", "#1c1f24")}
          color={useColorModeValue("#111718", "whiteAlpha.900")}
          fontSize="12px"
        >
          Time {get15MinBlock(tariffData? tariffData.ts : "Sat, 13 Sep 2025 12:41:00 GMT")}
        </Badge>
      </Flex>
    </Box>
  );
};

export default TariffCard;

function get15MinBlock(tsString: string): string {
  // Parse the input timestamp string into a Date object
  const date = new Date(tsString);
  
  // Get the hour and minute from the Date object
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  
  // Calculate the start of the 15-minute block by rounding the minute down
  const startMinute = Math.floor(minute / 15) * 15;
  
  // Calculate the end of the 15-minute block
  const endMinute = startMinute + 15;
  
  // Helper function to add a leading zero if a number is less than 10
  const formatTime = (num: number): string => {
    return num.toString().padStart(2, '0');
  };
  
  // Format the start hour and minute
  const formattedStartHour = formatTime(hour);
  const formattedStartMinute = formatTime(startMinute);
  
  // Format the end hour and minute, handling the case where the block crosses into the next hour
  let formattedEndHour = formattedStartHour;
  let formattedEndMinute = formatTime(endMinute);
  
  if (endMinute === 60) {
    // If the end minute is 60, it means the block ends at the next hour
    formattedEndHour = formatTime((hour + 1) % 24); // Use modulo to handle midnight (23:45-00:00)
    formattedEndMinute = '00';
  }
  
  // Combine the parts into the final block string
  return `${formattedStartHour}:${formattedStartMinute} - ${formattedEndHour}:${formattedEndMinute}`;
}