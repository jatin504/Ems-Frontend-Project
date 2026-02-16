import { Box, Text, VStack, HStack, useColorModeValue } from "@chakra-ui/react";

/* -------- ROUND GREEN LED (EXACT IMAGE STYLE) -------- */
const DotLed = ({ label }: { label: string }) => (
  <HStack spacing={3} align="center">
    <Box
      w="10px"
      h="10px"
      borderRadius="50%"
      bg="#00C853"
      boxShadow="0 0 4px #00C853"
    />
    <Text fontSize="11px" lineHeight="1">
      {label}
    </Text>
  </HStack>
);

export default function Led87T() {
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");

  return (
    <Box
      bg={primaryBg}
      rounded="12px"     
      p="16px"           
      width="220px"
      height="180px"
    >
      <Text
        fontSize="11px"
        fontWeight="bold"
        mb={2}
        textTransform="uppercase"
        color={primaryColor}
      >
        87T LED
      </Text>

      <VStack align="start" spacing={1}>
        <DotLed label="R-PHASE OPTD" />
        <DotLed label="Y-PHASE OPTD" />
        <DotLed label="B-PHASE OPTD" />
        <DotLed label="HV REF AND OF OPTD" />
        <DotLed label="BUCHHOLZ ALARM" />
        <DotLed label="PHV1 AND 2 OIL OSK TRIP" />
        <DotLed label="HV/LV WTI ALARM" />
        <DotLed label="TANK MOG LOW LEVEL" />
      </VStack>
    </Box>
  );
}
