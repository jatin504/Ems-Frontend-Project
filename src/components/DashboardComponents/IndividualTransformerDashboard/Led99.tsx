import { Box, Text, VStack, HStack, useColorModeValue } from "@chakra-ui/react";

/* -------- ROUND GREEN LED (SCADA STYLE) -------- */
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

export default function Led99() {
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");

  return (
    <Box
      bg={primaryBg}
      rounded="12px"     
      p="16px"           
      width="200px"
      height="180px"
    >
      <Text
        fontSize="11px"
        fontWeight="bold"
        mb={2}
        textTransform="uppercase"
        color={primaryColor}
      >
        99 LED
      </Text>

      <VStack align="start" spacing={1}>
        <DotLed label="HV OVERFLUX" />
        <DotLed label="LV REF OPTD" />
        <DotLed label="E/F PROTN" />
        <DotLed label="SPARE" />
        <DotLed label="SPARE" />
        <DotLed label="SPARE" />
        <DotLed label="SPARE" />
      </VStack>
    </Box>
  );
}
