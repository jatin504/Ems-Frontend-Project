import { Box, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";

const GreenTag = ({ label }: { label: string }) => (
  <Box
    bg="#7CFC90"
    border="1px solid #4CAF50"
    borderRadius="3px"
    textAlign="center"
    fontSize="12px"
    py="4px"
  >
    {label}
  </Box>
);

export default function TripRelayReset() {
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");

  return (
    <Box
      bg={primaryBg}
      rounded="12px"     
      p="16px"           
      width="260px"
      height="120px"
    >
      <Text fontSize="11px" fontWeight="bold" mb="6px" color={primaryColor}>
        TRIP RELAY RESET
      </Text>

      <SimpleGrid columns={2} spacing="10px">
        <GreenTag label="86A" />
        <GreenTag label="86B" />
        <GreenTag label="96" />
        <GreenTag label="86UF1" />
      </SimpleGrid>
    </Box>
  );
}
